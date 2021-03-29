const request = require("request");
const User = require("../models/User");

const addImage = (user, access_token, cb, id) => {
  const folowingOptions = {
    uri: "https://api.spotify.com/v1/me/following/contains?type=user&ids=" + id,
    headers: {
      Authorization: "Bearer " + user.lastSpotifyToken,
    },
    json: true,
  };
  //check if user follow main user
  request.get(folowingOptions, async (err, response, body) => {
    let friend = false;
    let image = "";
    if (!body[0]) {
      user = {
        _id: user._id,
        spotifyID: user.spotifyID,
        userName: user.userName,
        url: image,
        friend,
      };
      cb(user);
      return;
    }
    friend = true;

    //get image for friend
    const imageGetOptions = {
      uri: `https://api.spotify.com/v1/users/${user.spotifyID}`,
      headers: {
        Authorization: "Bearer " + access_token,
      },
      json: true,
    };

    request.get(imageGetOptions, async (error, response, body) => {
      if (body.images.length) {
        image = body.images[0].url;
      }
      user = {
        _id: user._id,
        spotifyID: user.spotifyID,
        userName: user.userName,
        url: image,
        friend,
      };
      cb(user);
    });
  });
};

const friends = (req, res) => {
  const req_id = req.get("Authorization");
  if (!req_id) {
    res.status(401).json({ message: `Unauthorized` });
    return;
  }
  User.find(
    {},
    { spotifyID: 1, lastSpotifyToken: 1, userName: 1 },
    (err, users) => {
      if (err || !user) {
        res.status(408).json({errorMessage:err.toString()});
        return;
      }

      // get user's info
      const access_token = users.filter(({ _id }) => _id == req_id)[0]
        .lastSpotifyToken;
      const id = users.filter(({ _id }) => _id == req_id)[0].spotifyID;
      // filter away user
      users = users.filter(({ _id }) => _id != req_id);

      const folowingOptions = {
        uri:
          "https://api.spotify.com/v1/me/following/contains?type=user&ids=" +
          users.map((user) => user.spotifyID).join(),
        headers: {
          Authorization: "Bearer " + access_token,
        },
        json: true,
      };

      //check if users are followed
      request.get(folowingOptions, async (err, response, body) => {
        users = users.filter((user, key) => body[key]);
        // check if followers and adds images to followees

        let requests = users.map((user) => {
          return new Promise((resolve) => {
            addImage(user, access_token, resolve, id);
          }).then((user) => {
            users.push(user);
          });
        });

        users = [];

        Promise.all(requests).then(() => {
          res.status(200).json(
            users
              .filter(({ friend }) => friend)
              .map(({ _id, spotifyID, userName, url }) => {
                return { _id, spotifyID, userName, url };
              })
          );
        });
      });
    }
  );
};

module.exports = friends;
