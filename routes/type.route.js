const router = require('express').Router();
const typeCtrl = require('./../controllers/typeCtrl');
const { isAuth, authorizeRoles } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router.post('/', isAuth, authorizeRoles('admin'), typeCtrl.createType);
 
router.get('/', typeCtrl.getAllTypes);

router.patch('/:id', isAuth, authorizeRoles('admin'), typeCtrl.updateType);

router.delete('/:id', isAuth, authorizeRoles('admin'), typeCtrl.deleteType);

module.exports = router;
