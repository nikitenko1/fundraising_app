const router = require('express').Router();
const authCtrl = require('./../controllers/authCtrl');
const { isAuth } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router.post('/register', authCtrl.register);
router.post('/activate', authCtrl.activateAccount);
router.post('/login', authCtrl.login);
router.get('/logout', isAuth, authCtrl.logout);
router.get('/refresh_token', authCtrl.refreshToken);

module.exports = router;
