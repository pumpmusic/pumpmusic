const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TokenTransaction = require('../models/Token');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/tokens/balance
 * @desc    Get user's token balance
 * @access  Private
 */
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('tokenBalance');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        tokenBalance: user.tokenBalance
      }
    });
  } catch (error) {
    console.error('Error fetching token balance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/tokens/purchase
 * @desc    Purchase tokens
 * @access  Private
 */
router.post('/purchase', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid token amount'
      });
    }

    // In a real application, this would include payment processing
    // For MVP, we'll simply add tokens to the user's account

    // Update user's token balance
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { tokenBalance: amount } },
      { new: true }
    ).select('tokenBalance');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create token transaction record
    await TokenTransaction.createPurchase(
      req.user.id,
      amount,
      `Purchased ${amount} tokens`
    );

    res.json({
      success: true,
      data: {
        tokenBalance: user.tokenBalance
      },
      message: `Successfully purchased ${amount} tokens`
    });
  } catch (error) {
    console.error('Error purchasing tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/tokens/transactions
 * @desc    Get user's token transaction history
 * @access  Private
 */
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await TokenTransaction.getUserTransactions(req.user.id);

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching token transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;