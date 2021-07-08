import User from "../../models/User.js";
import api from "../api.js";
import timeDiff from "../../utils/timeDiff.js";

async function refresh_tokens() {
  try {
    const start = new Date();

    const users = await User.find(
      { refreshToken: { $ne: "" } },
      { _id: 0, lastSpotifyToken: 1, userName: 1 }
    );

    const requests = users.map((user) =>
      refreshAva(user).catch((err) =>
        console.log(`!avatars [${userName}]: ${err.message}`)
      )
    );

    Promise.all(requests).then(() => {
      const end = new Date();
      console.log(
        `avatars [${requests.length}]: updated in ${timeDiff(start, end)} sec`
      );
    });

    async function refreshAva({ lastSpotifyToken, userName }) {
      const user = await api({ route: `me`, token: lastSpotifyToken });
      const avatar = user.images.length ? user.images[0].url : "";
      await User.updateOne({ userName }, { avatar });
    }
  } catch (err) {
    console.error("!avatars [all]:" + err.message);
  }
}

export default refresh_tokens;
