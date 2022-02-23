import { URLSearchParams } from "url";
import fetch from "node-fetch";
import User from "#server/models/User.js";
import forAllUsers from "#server/includes/forAllUsers.js";

export async function refreshTokens() {
  await forAllUsers({ operation: "tokens" }, rewriteTokens);
}

async function rewriteTokens({ tokens: { refreshToken }, _id }) {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  const body = await fetch(`https://accounts.spotify.com/api/token`, {
    method: "POST",
    body: params,
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
  }).then((res) => res.json());

  const filter = { _id };

  if (body.error) {
    if (body.error === "invalid_grant") {
      await User.updateOne(filter, {
        "tokens.refreshToken": "",
        "settings.privacy": "private",
      });
    }
    throw new Error(body.error.message || body.error);
  }

  const update = { "tokens.token": body.access_token };
  await User.updateOne(filter, update);
}
