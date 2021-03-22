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
  const reqSpotifyID = req.query.spotifyID;

  User.find(
    {},
    { spotifyID: 1, _id: 0, lastSpotifyToken: 1, userName: 1 },
    (err, users) => {
      if (err) {
        console.log(err);
        return;
      }
      const access_token = users.filter(
        ({ spotifyID }) => spotifyID === reqSpotifyID
      )[0].lastSpotifyToken;
      users = users.filter(({ spotifyID }) => spotifyID !== reqSpotifyID);
      const folowingOptions = {
        uri:
          "https://api.spotify.com/v1/me/following/contains?type=user&ids=" +
          users.map((user) => user.spotifyID).join(),
        headers: {
          Authorization: "Bearer " + access_token,
        },
        json: true,
      };
      request.get(folowingOptions, async (err, response, body) => {
        await body.forEach((item, key) => {
          if (item === false) {
            users.splice(key, 1);
          }
        });

        let requests = users.reduce((promiseChain, user) => {
          return promiseChain.then(
            () =>
              new Promise((resolve) => {
                addImage(user, access_token, resolve);
              })
          );
        }, Promise.resolve());

        requests.then(() => {
          res.end(
            JSON.stringify(
              users.map(({ spotifyID, userName }, key) => {
                return { spotifyID, userName, url: images[key] };
              })
            )
          );
        });
        // let requests = users.map((user) => {
        //   return new Promise((resolve) => {
        //     addImage(user, access_token, resolve);
        //   });
        // });

        // Promise.all(requests).then(() => {
        //   res.end(
        //     JSON.stringify(
        //       users.map(({ spotifyID, userName }, key) => {
        //         return { spotifyID, userName, url: images[key] };
        //       })
        //     )
        //   );
        // });
      });
    }
  );
};

module.exports = friends;
