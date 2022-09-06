const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    campaign: {
      type: mongoose.Types.ObjectId,
      ref: 'campaign',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    words: {
      type: String,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const Donation = mongoose.model('donation', donationSchema);
module.exports = Donation;
