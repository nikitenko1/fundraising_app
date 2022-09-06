const router = require('express').Router();
const campaignCtrl = require('../controllers/campaignCtrl');
const { isAuth, authorizeRoles } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

// GET /api/campaign?page=1&limit=6&type_id=630de7dea18c974712947c64&search= 200 56.930 ms
router.get('/', campaignCtrl.getCampaigns);

router.get(
  '/fundraiser',
  isAuth,
  authorizeRoles('fundraiser'),
  campaignCtrl.getFundraiser
);

router.post(
  '/',
  isAuth,
  authorizeRoles('fundraiser'),
  campaignCtrl.createCampaign
);

router.get('/:id', campaignCtrl.getCampaign);

router.delete(
  '/:id',
  isAuth,
  authorizeRoles('fundraiser'),
  campaignCtrl.deleteCampaign
);

router.patch(
  '/:id',
  isAuth,
  authorizeRoles('fundraiser'),
  campaignCtrl.updateCampaign
);

module.exports = router;
