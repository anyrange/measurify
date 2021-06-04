import User from "../models/User.js";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import dotenv from "dotenv";
dotenv.config();

function refresh_tokens() {
  const start = new Date();
  function rewriteTokens({ refreshToken, userName }, cb) {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);

    fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      body: params,
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
    })
      .then(async (body) => {
        if (!body) return;
        body = await body.json();
        if (body.error) {
          console.log("user " + userName + " havent got his token");
          console.log("message: " + (body.error.message || body.error));
          if (body.error === "invalid_grant") {
            await User.updateOne({ userName }, { refreshToken: "" });
          }
          cb();
          return;
        }
        const filter = { userName };
        const update = {
          lastSpotifyToken: body.access_token,
        };

        await User.updateOne(filter, update);
        cb();
      })
      .catch((err) => {
        console.log("user " + userName + " havent got his token");
        console.log(err.message);
        cb();
      });
  }

  User.find(
    { refreshToken: { $ne: "" } },
    { _id: 0, refreshToken: 1, userName: 1 },
    (err, users) => {
      if (err) return console.log(err);

      let requests = users.map((user) => {
        return new Promise((resolve) => {
          rewriteTokens(user, resolve);
        });
      });

      Promise.all(requests).then(() => {
        const end = new Date();
        console.log(
          `--All ${requests.length} tokens refreshed in ${(
            (end.getTime() - start.getTime()) /
            1000
          ).toFixed(2)} sec [${new Date().toLocaleString("en-US", {
            timeZone: "Asia/Almaty",
          })}]--`
        );
      });
    }
  );
}

export default refresh_tokens;
