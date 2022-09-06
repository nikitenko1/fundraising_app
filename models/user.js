const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dvpy1nsjp/image/upload/v1635570881/sample.jpg',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    rf_token: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('user', userSchema);

module.exports = User;
