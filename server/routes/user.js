const User = require("../models/User");
const fetch = require("node-fetch");
const { ObjectId } = require("mongodb");
const user = async (req, res) => {
  try {
    const _id = req.get("Authorization");
    const customID = req.params.id;
    const userInDataBase = await User.findOne(
      { customID },
      { userName: 1, private: 1, avatar: 1 }
    );
    if (!userInDataBase) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    if (userInDataBase.private && _id != userInDataBase._id) {
      res.status(400).json({ message: "Private profile" });
      return;
    }

    const response = {};
    response.username = userInDataBase.userName;
    response.avatar = userInDataBase.avatar;

    const requests = [
      new Promise(async (resolve) => {
        const topRaw = await fetch(
          req.protocol + "://" + req.get("host") + "/top?range=5",
          {
            headers: {
              Authorization: userInDataBase._id,
            },
          }
        );
        const top = await topRaw.json();
        if (!top) throw new Error();
        resolve(top);
      }).then((top) => {
        response.top = top;
      }),
      new Promise(async (resolve) => {
        const historyRaw = await fetch(
          req.protocol +
            "://" +
            req.get("host") +
            "/listening-history?range=20",
          {
            headers: {
              Authorization: userInDataBase._id,
            },
          }
        );
        const history = await historyRaw.json();
        if (!history) throw new Error();
        resolve(history);
      }).then((history) => {
        response.history = history;
      }),
      new Promise(async (resolve) => {
        const agg = [
          {
            $match: {
              _id: ObjectId(userInDataBase._id),
            },
          },
          {
            $project: {
              "recentlyPlayed.duration_ms": 1,
              _id: 0,
            },
          },
          {
            $unwind: {
              path: "$recentlyPlayed",
            },
          },
          {
            $group: {
              _id: {},
              plays: {
                $sum: 1,
              },
              playtime: {
                $sum: "$recentlyPlayed.duration_ms",
              },
            },
          },
        ];
        const overview = await User.aggregate(agg);
        if (!overview) throw new Error();
        resolve(overview[0]);
      }).then((overview) => {
        response.overview = {
          plays: overview.plays,
          playtime: Math.round(overview.playtime / 1000 / 60),
        };
      }),
    ];

    Promise.all(requests)
      .then(async () => {
        try {
          res.status(200).json(response);
        } catch (e) {
          console.log(e);
          res.status(404).json({ message: "Something went wrong!" });
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(404).json({ message: "Something went wrong!" });
      });
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "Something went wrong!" });
  }
};
module.exports = user;
