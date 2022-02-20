import User from "#server/models/User.js";
import api from "#server/includes/api.js";
import timeDiff from "#server/utils/timeDiff.js";

async function refreshAvatar({ tokens: { token }, display_name }) {
  const user = await api({ route: `me`, token });
  const avatar = user.images.length ? user.images[0].url : "";
  await User.updateOne({ display_name }, { avatar });
}

async function refreshAvatars() {
  try {
    const start = new Date();

    const users = await User.find(
      { "tokens.refreshToken": { $ne: "" } },
      { _id: 0, "tokens.token": 1, display_name: 1 }
    );

    const requests = users.map((user) =>
      refreshAvatar(user).catch((err) =>
        console.log(`!avatars [${user.display_name}]: ${err.message}`)
      )
    );

    await Promise.all(requests);

    const end = new Date();
    console.log(
      `avatars [${requests.length}]: updated in ${timeDiff(start, end)} sec`
    );
  } catch (err) {
    console.error("!avatars [all]:" + err.message);
  }
}

export default refreshAvatars;
