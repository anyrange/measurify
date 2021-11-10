import User from "../../models/User.js";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import timeDiff from "../../utils/timeDiff.js";
import dotenv from "dotenv";
dotenv.config();

async function refresh_tokens() {
  try {
    const start = new Date();

    const users = await User.find(
      { "tokens.refreshToken": { $ne: "" } },
      { "tokens.refreshToken": 1, display_name: 1 }
    );

    const requests = users.map((user) =>
      rewriteTokens(user).catch((err) =>
        console.log(`!tokens [${user.display_name}]: ${err.message}`)
      )
    );

    await Promise.all(requests);

    const end = new Date();
    console.log(
      `tokens [${requests.length}]: updated in ${timeDiff(start, end)} sec`
    );
  } catch (err) {
    console.error("!tokens [all]:" + err.message);
  }
}

async function rewriteTokens({ tokens: { refreshToken }, _id }) {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const body = await fetch(`https://accounts.spotify.com/api/token`, {
    method: "POST",
    body: params,
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
    },
  }).then((res) => res.json());

  const filter = { _id };

  if (body.error) {
    if (body.error === "invalid_grant") {
      await User.deleteOne(filter);
    }
    throw new Error(body.error.message || body.error);
  }

  const update = { "tokens.token": body.access_token };
  await User.updateOne(filter, update);
}

export default refresh_tokens;
