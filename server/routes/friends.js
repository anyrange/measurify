const fetch = require("node-fetch");
const User = require("../models/User");

const addImage = (user, access_token, cb, id) => {
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
      res.status(400).json(err);
      return;
    })
    .then((res) => res.json())
    .then((body) => {
      if (body.error) {
        console.log(
          body.error.message +
            "; Error by " +
            user.userName +
            " while getting friendlist"
        );
        cb();
        return;
      }
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
      fetch(`https://api.spotify.com/v1/users/${user.spotifyID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
        .then((res) => res.json())
        .then((body) => {
          if (body.error) {
            console.log(
              body.error.message +
                "; Error by " +
                user.userName +
                " while getting friendlist"
            );
            cb();
            return;
          }
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
      if (err) {
        res.status(408).json({ errorMessage: err.toString() });
        return;
      }

      // get user's info
      const access_token = users.filter(({ _id }) => _id == req_id)[0]
        .lastSpotifyToken;
      const id = users.filter(({ _id }) => _id == req_id)[0].spotifyID;
      // filter away user
      users = users.filter(({ _id }) => _id != req_id);

      //check if users are followed
      fetch(
        "https://api.spotify.com/v1/me/following/contains?type=user&ids=" +
          users.map((user) => user.spotifyID).join(),
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
        .then((res) => res.json())
        .then((body) => {
          if (body.error) {
            res.status(body.error.status).json({ message: body.error.message });
            return;
          }
          users = users.filter((user, key) => body[key]);
          // check if followers and adds images to followees

          let requests = users.map((user) => {
            return new Promise((resolve) => {
              addImage(user, access_token, resolve, id);
            }).then((user) => {
              if (user && user.friend) {
                users.push(user);
              }
            });
          });

          users = [];

          Promise.all(requests).then(() => {
            if (!users.length) {
              res.status(200).json(users);
              return;
            }
            res.status(200).json(
              users.map(({ _id, spotifyID, userName, url }) => {
                return { _id, spotifyID, userName, url };
              })
            );
          });
        });
    }
  );
};

module.exports = friends;
