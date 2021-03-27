const request = require("request");
const User = require("../models/User");

const images = [];

const addImage = (user, access_token, cb) => {
  const imageGetOptions = {
    uri: `https://api.spotify.com/v1/users/${user.spotifyID}`,
    headers: {
      Authorization: "Bearer " + access_token,
    },
    json: true,
  };

  request.get(imageGetOptions, async (error, response, body) => {
    if (body.images.length) {
      images.push(body.images[0].url);
    } else {
      images.push("");
    }
    cb();
  });
};

const friends = (req, res) => {
  const req_id = req.get("Authorization");
  if (!req_id) {
    res.status(400).json({ message: `Unauthorized` });
    return;
  }
  User.find(
    {},
    { spotifyID: 1, lastSpotifyToken: 1, userName: 1 },
    (err, users) => {
      if (err) {
        res.setStatus(400).end(err);
        return;
      }

      
      // get user's access token
      const access_token = users.filter(({ _id }) => _id == req_id)[0].lastSpotifyToken;

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
      //check if users are friends
      request.get(folowingOptions, async (err, response, body) => {
        // adds parameter to the object of user
        await body.forEach((item, key) => {
          if (item) {
            users[key].friend = true;
            return;
          }
          users[key].friend = false;
        });

        // remains only friends
        users = users.filter(({ friend }) => friend);

        // adds images to friends
        let requests = users.reduce((promiseChain, user) => {
          return promiseChain.then(
            () =>
              new Promise((resolve) => {
                addImage(user, access_token, resolve);
              })
          );
        }, Promise.resolve());

        // response
        requests.then(() => {
          res.status(200).json(
            users.map(({ spotifyID, userName }, key) => {
              return { spotifyID, userName, url: images[key] };
            })
          );
        });
      });
    }
  );
};

module.exports = friends;
