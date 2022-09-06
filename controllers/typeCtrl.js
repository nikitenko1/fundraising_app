const Type = require('./../models/type');
const Campaign = require('./../models/campaign');

const Pagination = (req) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;
  return { page, skip, limit };
};

const typeCtrl = {
  createType: async (req, res) => {
    try {
      const { title } = req.body;

      if (!title)
        return res.status(400).json({ msg: 'Please provide type title.' });

      const type = await Type.findOne({ title });
      if (type)
        return res.status(400).json({
          msg: 'Failed to create campaign type. Type already exists.',
        });
      const newType = new Type({ title });
      await newType.save();

      return res.status(200).json({
        msg: `Type ${title} has been created successfully.`,
        type: newType,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAllTypes: async (req, res) => {
    try {
      const { skip, limit } = Pagination(req);

      const data = await Type.aggregate([
        {
          $facet: {
            totalData: [
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
        {
          $project: {
            // $arrayElemAt Returns the element at the specified array index.
            count: { $arrayElemAt: ['$totalCount.count', 0] },
            totalData: 1,
          },
        },
      ]);

      const types = data[0].totalData;
      const typeCount = data[0].count;
      let total_page = 0;

      if (types.length === 0) {
        total_page = 0;
      } else {
        if (typeCount % limit === 0) {
          total_page = typeCount / limit;
        } else {
          total_page = Math.floor(typeCount / limit) + 1;
        }
      }

      return res.status(200).json({ types, total_page });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateType: async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;

      if (!title)
        return res.status(400).json({ msg: 'Please provide type title.' });

      // $ne selects the documents where the value of the field is not equal to the specified value
      const validType = await Type.findOne({ _id: { $ne: id }, title });

      if (validType)
        return res.status(400).json({ msg: `${title} type already exists.` });

      const type = await Type.findOneAndUpdate(
        { _id: id },
        {
          title,
        },
        { new: true }
      );

      if (!type)
        return res
          .status(404)
          .json({ msg: `Campaign type with id:${id} not found.` });

      return res.status(200).json({
        msg: 'Campaign type has been updated successfully.',
        type,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteType: async (req, res) => {
    try {
      const { id } = req.params;

      const totalCampaign = await Campaign.find({
        type: id,
      }).countDocuments();
      if (totalCampaign > 0)
        return res.status(400).json({
          msg: 'Several campaigns still used this type. Failed to delete campaign type.',
        });

      const type = await Type.findByIdAndDelete(id);

      if (!type)
        return res
          .status(404)
          .json({ msg: `Campaign type with id:${id} not found.` });

      return res.status(200).json({
        msg: `Campaign type with id:${id} has been deleted successfully.`,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = typeCtrl;
