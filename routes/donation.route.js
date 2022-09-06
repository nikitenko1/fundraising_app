const router = require('express').Router();
const donationCtrl = require('../controllers/donationCtrl');
const { isAuth } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router.post('/', isAuth, donationCtrl.createDonation);

router.get('/', isAuth, donationCtrl.getDonationHistory);

router.get('/:campaign_id', donationCtrl.getCampaignDonation);

module.exports = router;
