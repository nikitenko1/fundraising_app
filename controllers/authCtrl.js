const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const authEmail = require('./../utils/authEmail');
const validateEmail = require('./../utils/validator');
const {
  generateActivationToken,
  generateAccessToken,
  generateRefreshToken,
} = require('./../utils/generateToken');

const loginUser = async (user, password, res) => {
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(400)
      .json({ msg: "'Invalid credential. Password does not match.'" });
  }

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id }, res);

  await User.findOneAndUpdate(
    { _id: user._id },
    {
      rf_token: refreshToken,
    }
  );

  return res.status(200).json({
    msg: `Authenticated as ${user.name}`,
    accessToken,
    user: {
      ...user._doc,
      password: '',
    },
  });
};

const authCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ msg: 'Please fill up every field.' });

      if (!validateEmail)
        return res
          .status(400)
          .json({ msg: 'Please provide valid email address.' });

      if (password.length < 8)
        return res
          .status(400)
          .json({ msg: 'Password should be at least 8 characters.' });

      const user = await User.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ msg: `Email ${email} has been used before.` });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = { name, email, password: passwordHash };
      const token = generateActivationToken({ newUser });
      const url = `${process.env.CLIENT_URL}/activate/${token}`;

      const emailFormat = authEmail('Account Activation', url);
      sendEmail(email, 'Account Activation', emailFormat);
      return res
        .status(200)
        .json({ msg: `Account activation email has been sent to ${email}.` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  activateAccount: async (req, res) => {
    try {
      const { token } = req.body;
      if (!token)
        return res
          .status(400)
          .json({ msg: 'Please provide account activation token.' });

      const { newUser } = jwt.verify(
        token,
        `${process.env.ACTIVATION_TOKEN_SECRET}`
      );
      if (!newUser)
        return res
          .status(400)
          .json({ msg: 'Account activation token invalid.' });

      const user = await User.findOne({ email: newUser.email });

      if (user)
        return res
          .status(400)
          .json({ msg: `Email ${newUser.email} has been used before.` });

      const activeUser = new User(newUser);
      await activeUser.save();
      return res
        .status(200)
        .json({ msg: 'Account has been activated successfully.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ msg: 'Please fill up every field.' });

      if (!validateEmail(email))
        return res
          .status(400)
          .json({ msg: 'Please provide valid email address.' });

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credential.' });

      loginUser(user, password, res);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    if (!req.user)
      return res.status(400).json({ msg: 'Invalid authentication.' });

    try {
      res.clearCookie('learnify_rfToken', {
        path: '/api/v1/auth/refresh_token',
      });

      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          rf_token: '',
        }
      );

      return res.status(200).json({ msg: 'Logout success.' });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const { learnify_rfToken: token } = req.cookies;

      if (!token)
        return res.status(400).json({ msg: '!token: Invalid authentication.' });

      const decoded = jwt.verify(token, `${process.env.REFRESH_TOKEN_SECRET}`);
      if (!decoded.id)
        return res
          .status(400)
          .json({ msg: '!decoded.id: Invalid authentication.' });

      const user = await User.findOne({ _id: decoded.id }).select(
        '-password +rf_token'
      );
      if (!user)
        return res.status(400).json({ msg: '!user: Invalid authentication.' });

      if (token !== user.rf_token)
        return res
          .status(400)
          .json({ msg: '!== user.rf_token: Invalid authentication.' });

      const accessToken = generateAccessToken({ id: user._id });
      const refreshToken = generateRefreshToken({ id: user._id }, res);

      await User.findOneAndUpdate(
        { _id: user._id },
        {
          rf_token: refreshToken,
        }
      );

      return res.status(200).json({
        accessToken,
        user,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = authCtrl;
