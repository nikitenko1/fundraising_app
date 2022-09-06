const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Type = mongoose.model('type', typeSchema);
module.exports = Type;
