const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Types.ObjectId,
      ref: 'campaign',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Withdraw = mongoose.model('withdraw', withdrawSchema);
module.exports = Withdraw;
