import { URLSearchParams } from "url";
import fetch from "node-fetch";
import User from "#server/models/User.js";
import forAllUsers from "#server/includes/forAllUsers.js";
import { timeDiff } from "#server/utils/index.js";

export async function refreshTokens() {
  await forAllUsers({ operation: "tokens" }, rewriteTokens);
}

const MONTH = 60 * 60 * 24 * 30;

async function rewriteTokens({ tokens, _id, lastLogin }) {
  const filter = { _id };

  if (timeDiff(lastLogin, new Date()) > 3 * MONTH) {
    await deactivateProfile(filter);
    return;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", tokens.refreshToken);

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

  if (body.error) {
    if (body.error === "invalid_grant") {
      await deactivateProfile(filter);
    }
    throw new Error(body.error.message || body.error);
  }

  const update = { "tokens.token": body.access_token };
  await User.updateOne(filter, update);
}

const deactivateProfile = (filter) => {
  return User.updateOne(filter, {
    "tokens.refreshToken": "",
  });
};
