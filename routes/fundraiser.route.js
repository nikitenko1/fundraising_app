const router = require('express').Router();
const fundraiserCtrl = require('./../controllers/fundraiserCtrl');
const { isAuth, authorizeRoles } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router.post('/', isAuth, fundraiserCtrl.createFundraiser);

router.get('/', fundraiserCtrl.getAllFundraisers);

router.patch(
  '/status/:id',
  isAuth,
  authorizeRoles('admin'),
  fundraiserCtrl.changeFundraiserStatus
);

router.delete(
  '/:id',
  isAuth,
  authorizeRoles('admin'),
  fundraiserCtrl.deleteFundraiser
);

module.exports = router;
