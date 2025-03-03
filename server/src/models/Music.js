const mongoose = require('mongoose');

/**
 * Music Schema
 * Stores information about generated music tracks
 */
const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required'],
    trim: true,
    maxlength: [500, 'Prompt cannot be more than 500 characters']
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required']
  },
  duration: {
    type: Number,
    default: 0
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  genre: {
    type: String,
    enum: ['pop', 'rock', 'jazz', 'classical', 'electronic', 'ambient', 'hip-hop', 'other'],
    default: 'other'
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'energetic', 'calm', 'dark', 'uplifting', 'other'],
    default: 'other'
  },
  likes: {
    type: Number,
    default: 0
  },
  plays: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Method to increment play count
 */
musicSchema.methods.incrementPlays = async function() {
  this.plays += 1;
  return this.save();
};

/**
 * Method to toggle like status
 */
musicSchema.methods.toggleLike = async function() {
  this.likes += 1;
  return this.save();
};

/**
 * Static method to find public tracks
 */
musicSchema.statics.findPublicTracks = async function(limit = 20, skip = 0) {
  return this.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('creator', 'username profilePicture')
    .exec();
};

/**
 * Static method to find user's tracks
 */
musicSchema.statics.findUserTracks = async function(userId, limit = 20, skip = 0) {
  return this.find({ creator: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

const Music = mongoose.model('Music', musicSchema);

module.exports = Music;