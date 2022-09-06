const Fundraiser = require('./../models/fundraiser');
const User = require('./../models/user');

const Pagination = (req) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;
  return { page, skip, limit };
};

const fundraiserCtrl = {
  createFundraiser: async (req, res) => {
    try {
      const { phone, address, description } = req.body;
      if (!phone || !address || !description)
        return res.status(400).json({
          msg: 'Please provide required field to create fundraiser account.',
        });

      const findUser = await Fundraiser.findOne({ user: req.user._id });
      if (findUser)
        return res.status(400).json({
          msg: 'Fundraiser with current user account already exists. Please wait for account approval.',
        });

      const findPhone = await Fundraiser.findOne({ phone: phone });
      if (findPhone)
        return res.status(400).json({
          msg: 'Phone number has been used before.',
        });
      const newFundraiser = new Fundraiser({
        user: req.user._id,
        phone,
        address,
        description,
      });
      const fundraiser = await newFundraiser.save();
      return res.status(200).json({
        msg: `Fundraiser has been created successfully.`,
        fundraiser: fundraiser,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAllFundraisers: async (req, res) => {
    try {
      const { skip, limit } = Pagination(req);

      const data = await Fundraiser.aggregate([
        {
          $facet: {
            totalData: [
              {
                $lookup: {
                  from: 'users',
                  localField: 'user',
                  foreignField: '_id',
                  as: 'user',
                },
              },
              { $unwind: '$user' },
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
      const fundraisers = data[0].totalData;
      const fundraisersCount = data[0].count;
      let totalPage = 0;

      if (fundraisers.length === 0) {
        totalPage = 0;
      } else {
        if (fundraisersCount % limit === 0) {
          totalPage = fundraisersCount / limit;
        } else {
          totalPage = Math.floor(fundraisersCount / limit) + 1;
        }
      }

      return res.status(200).json({ fundraisers, totalPage });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  changeFundraiserStatus: async (req, res) => {
    try {
      const fundraiser = await Fundraiser.findOneAndUpdate(
        { _id: req.params.id },
        [{ $set: { isActive: { $not: '$isActive' } } }],
        { new: true }
      );

      if (!fundraiser)
        return res.status(400).json({
          msg: 'Failed to change fundraiser status. Please try again later.',
        });

      const updatedUser = await User.findOneAndUpdate(
        { _id: fundraiser.user },
        { role: 'fundraiser' },
        { new: true }
      );

      return res.status(200).json({
        user: updatedUser._doc,
        msg: 'Fundraiser status has been changed successfully. User role set `fundraiser`',
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // deleteDonor: async (req, res) => {
  //   try {
  //     const donor = await Donor.findByIdAndDelete(req.params.id);
  //     await User.findByIdAndDelete(donor.user);
  //     await Event.deleteMany({ user: donor.user });
  //   } catch (err) {
  //     return res.status(500).json({ msg: err.message });
  //   }
  // },

  deleteFundraiser: async (req, res) => {
    try {
      const fundraiser = await Fundraiser.findByIdAndDelete(req.params.id);
      if (!fundraiser)
        return res.status(404).json({ msg: 'Fundraiser not found.' });

      const updatedUser = await User.findOneAndUpdate(
        { _id: fundraiser.user },
        { role: 'user' },
        { new: true }
      );

      return res.status(200).json({
        user: updatedUser._doc,
        msg: 'Fundraiser has been deleted successfully.. User role set `user`',
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = fundraiserCtrl;
