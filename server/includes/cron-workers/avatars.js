import User from "#server/models/User.js";
import api from "#server/includes/api.js";
import forAllUsers from "#server/includes/forAllUsers.js";

export async function refreshAvatars() {
  await forAllUsers({ operation: "avatars" }, refreshAvatar);
}

async function refreshAvatar({ tokens: { token }, display_name }) {
  const user = await api({ route: `me`, token });
  const avatar = user.images.length ? user.images[0].url : "";
  await User.updateOne({ display_name }, { avatar });
}
