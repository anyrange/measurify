const User = require("../models/User");
const users = {
  number: async (req, res) => {
    try {
      const usersQuantity = await User.estimatedDocumentCount();
      res.status(200).json({ usersQuantity });
    } catch (e) {
      res.status(404).json();
      console.log(e);
    }
  },
  top: async (req, res) => {
    try {
      const agg = [
        {
          $project: {
            userName: 1,
            _id: 0,
            customID: 1,
            listened: {
              $cond: {
                if: {
                  $isArray: "$recentlyPlayed",
                },
                then: {
                  $size: "$recentlyPlayed",
                },
                else: 0,
              },
            },
          },
        },
        {
          $sort: {
            listened: -1,
          },
        },
      ];
      const top = await User.aggregate(agg);
      res.status(200).json(top);
    } catch (e) {
      res.status(404).json();
      console.log(e);
    }
  },
};
module.exports = users;
