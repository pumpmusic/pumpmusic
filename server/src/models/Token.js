const mongoose = require('mongoose');

/**
 * Token Transaction Schema
 * Records all token-related transactions in the system
 */
const tokenTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['purchase', 'usage', 'reward', 'refund'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Static method to create a new token purchase transaction
 */
tokenTransactionSchema.statics.createPurchase = async function(userId, amount, description) {
  return this.create({
    user: userId,
    amount: amount,
    type: 'purchase',
    description: description || `Purchased ${amount} tokens`
  });
};

/**
 * Static method to create a new token usage transaction
 */
tokenTransactionSchema.statics.createUsage = async function(userId, amount, description) {
  return this.create({
    user: userId,
    amount: -Math.abs(amount), // Ensure amount is negative for usage
    type: 'usage',
    description: description || `Used ${amount} tokens`
  });
};

/**
 * Static method to get user's transaction history
 */
tokenTransactionSchema.statics.getUserTransactions = async function(userId) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .exec();
};

const TokenTransaction = mongoose.model('TokenTransaction', tokenTransactionSchema);

module.exports = TokenTransaction;