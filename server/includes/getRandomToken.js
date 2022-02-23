import User from "#server/models/User.js";

export default async function getRandomToken() {
  const user = await User.findOne(
    { "tokens.refreshToken": { $ne: "" } },
    "tokens.token"
  );
  return user.tokens.token;
}
