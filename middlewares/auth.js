const User = require('./../models/user');
const jwt = require('jsonwebtoken');

module.exports.isAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) return res.status(400).json({ msg: 'Invalid authentication.' });

    const decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
    if (!decoded.id)
      return res.status(400).json({ msg: 'Invalid authentication.' });

    const user = await User.findOne({ _id: decoded.id });
    if (!user) return res.status(400).json({ msg: 'Invalid authentication.' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        msg: `User with role ${req.user.role} can't access this resource.`,
      });
    }
    next();
  };
};
