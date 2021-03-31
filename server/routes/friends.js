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
        url: "",
        friend: false,
      };
      if (!body[0]) {
        cb(friend);
        return;
      }
      friend.friend = true;
      //get image for friend
      fetch(`https://api.spotify.com/v1/users/${user.spotifyID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
        .catch((err) => {
          friend.message = err.message;
          cb(friend);
        })
        .then(async (body) => {
          if (!body) {
            return;
          }
          body = await body.json();
          if (body.error) {
            friend.message = `${body.error.message} [${body.error.status}]`;
            cb(friend);
            return;
          }
          friend.url =
            body.images && body.images.length ? body.images[0].url : "";
          friend.message = body.error ? body.error.message : "";
          cb(friend);
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
        res.status(408).json({ message: err.toString() });
        return;
      }

      // get user's info
      const access_token = users.find(({ _id }) => _id == req_id)
        .lastSpotifyToken;
      const id = users.find(({ _id }) => _id == req_id).spotifyID;
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
        .catch((err) => {
          res.status(400).json({ message: err.message });
        })
        .then(async (body) => {
          if (!body) {
            return;
          }
          body = await body.json();
          if (body.error) {
            res.status(body.error.status).json({
              message: body.error.message,
            });
            return;
          }

          users = users.filter((user, key) => body[key]);
          // check if followers and adds images to followees

          let requests = users.map((user) => {
            return new Promise((resolve) => {
              addImage(user, access_token, resolve, id);
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
        });
    }
  );
};

module.exports = friends;
