const fetch = require("node-fetch");
const User = require("../models/User");

const friends = async (req, res) => {
  try {
    const req_id = req.get("Authorization");
    let users = await User.find(
      {},
      { spotifyID: 1, lastSpotifyToken: 1, userName: 1, image: 1 }
    );

    // get user's info
    const access_token = users.find(({ _id }) => _id == req_id)
      .lastSpotifyToken;
    const id = users.find(({ _id }) => _id == req_id).spotifyID;
    // filter away user
    users = users.filter(({ _id }) => _id != req_id);

    //check if users are followed
    const followArray = await fetch(
      "https://api.spotify.com/v1/me/following/contains?type=user&ids=" +
        users.map((user) => user.spotifyID).join(),
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );

    if (!followArray) throw new Error("spotify error");
    body = await followArray.json();
    if (body.error) {
      console.log(body);
      res.status(body.error.status).json({
        message: body.error.message,
      });
      return;
    }

    users = users.filter((user, key) => body[key]);
    // check if followers and adds images to followees
    if (!users.length) {
      res.status(204).json();
      return;
    }

    let requests = users.map((user) => {
      return new Promise((resolve) => {
        addImage(user, resolve, id);
      }).then((user) => {
        if (user && user.friend) {
          delete user.friend;
          if (!user.message) {
            delete user.message;
          }
          users.push(user);
        }
      });
    });

    users = [];

    Promise.all(requests).then(() => {
      res.status(200).json(users);
    });
  } catch (e) {
    res.status(404).json();
    console.log(e);
  }
};

const addImage = (user, cb, id) => {
  //check if user follow main user
  fetch(
    "https://api.spotify.com/v1/me/following/contains?type=user&ids=" + id,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user.lastSpotifyToken,
      },
    }
  )
    .catch((err) => {
      console.log(
        err.message +
          "; Error by " +
          user.userName +
          " while getting friendlist of " +
          id
      );
      cb();
      return;
    })
    .then(async (body) => {
      if (!body) {
        return;
      }
      body = await body.json();
      if (body.error) {
        console.log(
          `${body.error.message} [${body.error.status}]` +
            "; Error by " +
            user.userName +
            " while getting friendlist"
        );
        cb();
        return;
      }
      //friend schema

      let friend = {
        _id: user._id,
        spotifyID: user.spotifyID,
        userName: user.userName,
        url: user.image,
        friend: body[0],
      };
      cb(friend);
    });
};

module.exports = friends;
