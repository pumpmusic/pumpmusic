const express = require('express');
const router = express.Router();
const Music = require('../models/Music');
const User = require('../models/User');
const TokenTransaction = require('../models/Token');
const auth = require('../middleware/auth');
const { Configuration, OpenAIApi } = require('openai');

// Configure OpenAI API
const configuration = new Configuration({
  apiKey: process.env.AI_MODEL_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * @route   POST /api/music/generate
 * @desc    Generate music from a prompt
 * @access  Private
 */
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, title, isPublic = true, genre = 'other', mood = 'other' } = req.body;
    
    // Validate prompt
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a prompt for music generation'
      });
    }

    // Check if user has enough tokens
    const user = await User.findById(req.user.id);
    const tokenCost = 1; // Cost per generation
    
    if (user.tokenBalance < tokenCost) {
      return res.status(400).json({
        success: false,
        message: 'Not enough tokens. Please purchase more tokens.'
      });
    }

    // For MVP, we'll simulate AI music generation
    // In a production environment, this would call an actual music generation API
    
    // Simulate API call delay
    const generationStartTime = Date.now();
    
    // This is a placeholder for the actual AI music generation
    // In a real implementation, you would call your AI model API here
    // const response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: `Create music that sounds like: ${prompt}`,
    //   max_tokens: 100
    // });
    
    // For MVP, we'll use a mock audio URL
    // In production, this would be the URL to the generated audio file
    const mockAudioUrl = `https://storage.pumpmusic.com/generated/${Date.now()}.mp3`;
    const mockDuration = Math.floor(Math.random() * 180) + 60; // Random duration between 60-240 seconds
    
    // Create new music entry
    const music = new Music({
      title: title || `Generated from: ${prompt.substring(0, 30)}...`,
      prompt,
      audioUrl: mockAudioUrl,
      duration: mockDuration,
      creator: req.user.id,
      isPublic,
      genre,
      mood,
      tags: prompt.split(' ').filter(word => word.length > 3).slice(0, 5) // Extract tags from prompt
    });
    
    await music.save();
    
    // Deduct tokens from user
    user.tokenBalance -= tokenCost;
    await user.save();
    
    // Record token usage
    await TokenTransaction.createUsage(
      req.user.id,
      tokenCost,
      `Generated music: ${music.title}`
    );
    
    // Calculate generation time
    const generationTime = (Date.now() - generationStartTime) / 1000;
    
    res.status(201).json({
      success: true,
      data: {
        music,
        generationTime: `${generationTime.toFixed(2)} seconds`,
        remainingTokens: user.tokenBalance
      },
      message: 'Music generated successfully'
    });
  } catch (error) {
    console.error('Error generating music:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during music generation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/music/history
 * @desc    Get user's generation history
 * @access  Private
 */
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const music = await Music.findUserTracks(req.user.id, limit, skip);
    const total = await Music.countDocuments({ creator: req.user.id });
    
    res.json({
      success: true,
      data: {
        music,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching music history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/music/library
 * @desc    Get public music library
 * @access  Public
 */
router.get('/library', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const music = await Music.findPublicTracks(limit, skip);
    const total = await Music.countDocuments({ isPublic: true });
    
    res.json({
      success: true,
      data: {
        music,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching music library:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/music/:id
 * @desc    Get a specific music track
 * @access  Public for public tracks, Private for private tracks
 */
router.get('/:id', async (req, res) => {
  try {
    const music = await Music.findById(req.params.id)
      .populate('creator', 'username profilePicture');
    
    if (!music) {
      return res.status(404).json({
        success: false,
        message: 'Music track not found'
      });
    }
    
    // Check if music is private and user is not the creator
    if (!music.isPublic) {
      // If no auth token, deny access
      if (!req.header('Authorization')) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to access this track'
        });
      }
      
      try {
        // Verify token manually since this route doesn't use auth middleware by default
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
        const user = await User.findById(decoded.id);
        
        // If user is not the creator, deny access
        if (!user || user._id.toString() !== music.creator._id.toString()) {
          return res.status(403).json({
            success: false,
            message: 'You do not have permission to access this track'
          });
        }
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Invalid authentication token'
        });
      }
    }
    
    // Increment play count
    await music.incrementPlays();
    
    res.json({
      success: true,
      data: music
    });
  } catch (error) {
    console.error('Error fetching music track:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/music/:id/like
 * @desc    Like a music track
 * @access  Private
 */
router.post('/:id/like', auth, async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    
    if (!music) {
      return res.status(404).json({
        success: false,
        message: 'Music track not found'
      });
    }
    
    // Toggle like
    await music.toggleLike();
    
    res.json({
      success: true,
      data: {
        likes: music.likes
      },
      message: 'Track liked successfully'
    });
  } catch (error) {
    console.error('Error liking music track:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;