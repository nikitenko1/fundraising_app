const Type = require('../models/type');
const Campaign = require('./../models/campaign');
const mongoose = require('mongoose');

const Pagination = (req) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;
  return { page, skip, limit };
};

const campaignCtrl = {
  createCampaign: async (req, res) => {
    try {
      const { type, title, description, image, targetAmount } = req.body;

      if (!type || !title || !description || !image || !targetAmount)
        return res
          .status(400)
          .json({ msg: 'Please provide required field to create campaign.' });

      const campaignType = await Type.findOne({ _id: type });
      if (!campaignType)
        return res.status(400).json({ msg: 'Campaign type not found.' });

      const slugify = (str) =>
        str
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');

      const campaignSlug = await Campaign.findOne({ slug: slugify(title) });
      if (campaignSlug)
        return res.status(400).json({
          msg: `Campaign with title: ${title} already exists.`,
        });

      const newCampaign = new Campaign({
        fundraiser: req.user._id,
        type,
        title,
        description,
        image,
        targetAmount,
        slug: slugify(title),
      });

      await newCampaign.save();

      const typeDetail = await Type.findById(type);

      return res.status(200).json({
        msg: `Campaign ${title} has been created successfully.`,
        campaign: newCampaign,
        type: typeDetail.title,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getCampaign: async (req, res) => {
    const { id } = req.params;
    try {
      const campaign = await Campaign.aggregate([
        { $match: { slug: id } },

        {
          $lookup: {
            from: 'fundraisers',
            let: { fundraiser_id: '$fundraiser' },
            pipeline: [
              { $match: { $expr: { $eq: ['$user', '$$fundraiser_id'] } } },

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
                        email: 1,
                      },
                    },
                  ],
                  as: 'user',
                },
              },
              { $unwind: '$user' },
            ],
            as: 'fundraiser',
          },
        },
        { $unwind: '$fundraiser' },
      ]);

      if (!campaign)
        return res
          .status(404)
          .json({ msg: `Campaign with ID: ${id} not found.` });

      return res.status(200).json({
        campaign: campaign[0],
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // GET /api/campaign?page=1&limit=6&type_id=630de7dea18c974712947c64&search= 200
  getCampaigns: async (req, res) => {
    const { skip, limit } = Pagination(req);

    const dataAggregation = [
      {
        $lookup: {
          from: 'types',
          localField: 'type',
          foreignField: '_id',
          as: 'type',
        },
      },
      { $unwind: '$type' },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    // GET /api/v1/product/home?category=62e8cb6b0dc34b52d3d1ebda&&&&page=1&sortBy=date&sortType=desc 200 148.811 ms - 974
    const countAggregation = [{ $count: 'count' }];

    let typeQuery = '';
    if (req.query.type_id) {
      typeQuery = new mongoose.Types.ObjectId(`${req.query.type_id}`);
    }

    if (typeQuery) {
      dataAggregation.unshift({
        $match: { type: { $eq: typeQuery } },
      });

      countAggregation.unshift({
        $match: { type: { $eq: typeQuery } },
      });
    }

    if (req.query.search) {
      const searchAggregate = await Campaign.aggregate([
        {
          $search: {
            index: 'campaign',
            autocomplete: {
              query: req.query.search,
              path: 'title',
            },
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      dataAggregation.unshift(searchAggregate);
    }

    try {
      const data = await Campaign.aggregate([
        {
          $facet: {
            totalData: dataAggregation,
            totalCount: countAggregation,
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ['$totalCount.count', 0] },
            totalData: 1,
          },
        },
      ]);

      const campaignData = data[0].totalData;
      const totalCampaign = data[0].count;
      let totalPage = 0;

      if (campaignData.length === 0) {
        totalPage = 0;
      } else {
        if (totalCampaign % limit === 0) {
          totalPage = totalCampaign / limit;
        } else {
          totalPage = Math.floor(totalCampaign / limit) + 1;
        }
      }

      return res.status(200).json({
        campaigns: campaignData,
        total_page: totalPage,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getFundraiser: async (req, res) => {
    try {
      const { skip, limit } = Pagination(req);

      const data = await Campaign.aggregate([
        {
          $facet: {
            totalData: [
              {
                $lookup: {
                  from: 'fundraisers',
                  let: { fundraiser_id: '$fundraiser' },
                  pipeline: [
                    // const fundraiserSchema = new mongoose.Schema(
                    //   {user
                    //     fundraiser: {
                    //       type: mongoose.Types.ObjectId,
                    //       ref: 'user',
                    //       required: true,
                    //     },
                    {
                      $lookup: {
                        from: 'users',
                        let: { user_id: '$user' },
                        pipeline: [
                          {
                            $match: {
                              $expr: { $eq: [req.user._id, '$$user_id'] },
                            },
                          },
                        ],
                        as: 'auth_user',
                      },
                    },
                    {
                      $match: {
                        fundraiser: '$auth_user',
                      },
                    },
                  ],
                  as: 'campaign',
                },
              },

              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
        {
          $project: {
            totalData: 1,
            count: { $arrayElemAt: ['$totalCount.count', 0] },
          },
        },
      ]);
      const campaignData = data[0].totalData;
      const totalCampaign = data[0].count;
      let totalPage = 0;

      if (campaignData.length === 0) {
        totalPage = 0;
      } else {
        if (totalCampaign % limit === 0) {
          totalPage = totalCampaign / limit;
        } else {
          totalPage = Math.floor(totalCampaign / limit) + 1;
        }
      }

      return res.status(200).json({
        campaigns: campaignData,
        total_page: totalPage,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteCampaign: async (req, res) => {
    const { id } = req.params;
    try {
      const findCampaign = await Campaign.find({
        id: req.params.id,
        fundraiser: req.user._id,
      });
      if (!findCampaign)
        return res.status(404).json({
          msg: 'Campaign is not belong to current authenticated fundraiser.',
        });

      const campaign = await Campaign.findByIdAndDelete(id);
      if (!campaign)
        return res.status(404).json({ msg: 'Campaign not found.' });

      return res
        .status(200)
        .json({ msg: 'Campaign has been deleted successfully.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateCampaign: async (req, res) => {
    const { id } = req.params;

    try {
      const { type, title, description, image, targetAmount } = req.body;

      if (!type || !title || !description || !image || !targetAmount)
        return res.status(400).json({
          msg: 'The data to change the campaign is not filled in completely.',
        });

      const slugify = (str) =>
        str
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');

      const updateCampaign = await Campaign.findOneAndUpdate(
        { _id: id },
        {
          type,
          title,
          description,
          image,
          targetAmount,
          slug: slugify(title),
        },
        { new: true }
      );

      const typeDetail = await Type.findById(type);

      return res.status(200).json({
        msg: `Campaign ${title} has been updated successfully.`,
        campaign: updateCampaign._doc,
        type: typeDetail.title,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = campaignCtrl;
