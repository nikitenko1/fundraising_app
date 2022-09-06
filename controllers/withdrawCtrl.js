const Withdraw = require('./../models/withdraw');
const Campaign = require('./../models/campaign');
const mongoose = require('mongoose');

const Pagination = (req) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;
  return { page, skip, limit };
};

const withdrawCtrl = {
  createWithdraw: async (req, res) => {
    try {
      const { amount, campaign_id } = req.body;

      const validCampaign = await Campaign.findById({
        _id: campaign_id,
      });
      console.log(validCampaign.withdrawnAmount);
      if (!validCampaign)
        return res.status(400).json({
          msg: `There's no campaign found with provided id and current authenticated fundraiser.`,
        });

      if (!amount)
        return res.status(400).json({ msg: 'Please provide amount field.' });

      if (
        amount >
        validCampaign.collectedAmount - validCampaign.withdrawnAmount
      ) {
        return res.status(400).json({
          msg: `Invalid withdraw amount. CollectedAmount is only: ${validCampaign.collectedAmount}.`,
        });
      }

      const newWithdraw = new Withdraw({ campaign: campaign_id, amount });
      await newWithdraw.save();

      const updateCampaign = await Campaign.findOneAndUpdate(
        { _id: campaign_id },
        {
          withdrawnAmount: validCampaign.withdrawnAmount + amount,
        },
        { new: true }
      );

      if (!updateCampaign)
        return res.status(400).json({
          msg: `Failed to update campaign withdrawn amount. Please try again later.`,
        });

      return res.status(200).json({
        msg: 'Withdraw has been done successfully.',
        withdraw: newWithdraw,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getCampaignWithdraw: async (req, res) => {
    const { skip, limit } = Pagination(req);

    try {
      const { id } = req.params;

      const data = await Withdraw.aggregate([
        {
          $facet: {
            totalData: [
              {
                $lookup: {
                  from: 'campaigns',
                  let: { campaign_id: '$campaign' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$campaign_id'] } } },
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
                  campaign: new mongoose.Types.ObjectId(id),
                },
              },
              { $count: 'count' },
            ],
          },
        },
        {
          $project: {
            totalData: 1,
            count: { $arrayElemAt: ['$totalCount.count', 0] },
          },
        },
      ]);
      const withdrawsData = data[0].totalData;
      const totalWithdraw = data[0].count;
      let total_page = 0;

      if (withdrawsData.length === 0) {
        total_page = 0;
      } else {
        if (totalWithdraw % limit === 0) {
          total_page = totalWithdraw / limit;
        } else {
          total_page = Math.floor(totalWithdraw / limit) + 1;
        }
      }

      return res.status(200).json({
        withdraws: withdrawsData,
        total_page,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = withdrawCtrl;
