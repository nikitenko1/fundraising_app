const Donation = require('./../models/donation');
const Campaign = require('./../models/campaign');
const mongoose = require('mongoose');

const Pagination = (req) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;
  return { page, skip, limit };
};

const donationCtrl = {
  createDonation: async (req, res) => {
    try {
      const { amount, words, isAnonymous, id } = req.body;
      if (!amount)
        return res
          .status(400)
          .json({ msg: 'Please provide required field to donate.' });

      const validCampaign = await Campaign.findOne({
        _id: id,
      });

      if (!validCampaign)
        return res.status(400).json({
          msg: `There's no campaign found with provided id: ${id}.`,
        });

      const updateCampaign = await Campaign.findOneAndUpdate(
        { _id: id },
        {
          collectedAmount: validCampaign.collectedAmount + amount,
        },
        { new: true }
      );

      const newDonation = new Donation({
        user: req.user._id,
        campaign: id,
        amount,
        words,
        isAnonymous,
      });
      await newDonation.save();

      return res.status(200).json({
        donation: newDonation,
        campaign: updateCampaign,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getDonationHistory: async (req, res) => {
    try {
      const { skip, limit } = Pagination(req);

      const data = await Donation.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  user: new mongoose.Types.ObjectId(req.user._id),
                },
              },
              {
                $lookup: {
                  from: 'campaigns',
                  let: { campaign_id: '$campaign' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$campaign_id'] } } },
                    {
                      $project: {
                        _id: 0,
                        image: 1,
                        title: 1,
                        slug: 1,
                      },
                    },
                  ],
                  as: 'campaign',
                },
              },
              { $unwind: '$campaign' },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              {
                $match: {
                  campaign: new mongoose.Types.ObjectId(req.user._id),
                },
              },
              { $count: 'count' },
            ],
          },
        },
      ]);

      const donationsData = data[0].totalData;
      const totalReview = data[0].count;
      let total_page = 0;

      if (donationsData.length === 0) {
        total_page = 0;
      } else {
        if (totalReview % limit === 0) {
          total_page = totalReview / limit;
        } else {
          total_page = Math.floor(totalReview / limit) + 1;
        }
      }

      return res.status(200).json({
        donations: donationsData,
        total_page,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getCampaignDonation: async (req, res) => {
    const { campaign_id } = req.params;
    const { skip, limit } = Pagination(req);
    try {
      const data = await Donation.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  campaign: new mongoose.Types.ObjectId(campaign_id),
                },
              },
              {
                $lookup: {
                  from: 'users',
                  let: { user_id: '$user' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
                    {
                      $project: {
                        _id: 0,
                        name: 1,
                        avatar: 1,
                      },
                    },
                  ],
                  as: 'user',
                },
              },
              { $unwind: '$user' },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              {
                $match: {
                  campaign: new mongoose.Types.ObjectId(campaign_id),
                },
              },
              { $count: 'count' },
            ],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ['$totalCount.count', 0] },
            totalData: 1,
          },
        },
      ]);

      const donationsData = data[0].totalData;
      const totalReview = data[0].count;
      let total_page = 0;

      if (donationsData.length === 0) {
        total_page = 0;
      } else {
        if (totalReview % limit === 0) {
          total_page = totalReview / limit;
        } else {
          total_page = Math.floor(totalReview / limit) + 1;
        }
      }

      return res.status(200).json({
        donations: donationsData,
        total_page,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = donationCtrl;
