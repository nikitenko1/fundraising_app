const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    fundraiser: {
      type: mongoose.Types.ObjectId,
      ref: 'fundraiser',
      required: true,
    },
    type: {
      type: mongoose.Types.ObjectId,
      ref: 'type',
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      default: false,
    },
    collectedAmount: {
      type: Number,
      default: 0,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    withdrawnAmount: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);
const Campaign = mongoose.model('campaign', campaignSchema);
module.exports = Campaign;
