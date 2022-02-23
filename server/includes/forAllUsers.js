import User from "#server/models/User.js";
import { timeDiff } from "#server/utils/index.js";

export default async function ({ operation = "unknown operation" }, cb) {
  try {
    const start = new Date();

    const users = await User.find(
      { "tokens.refreshToken": { $ne: "" } },
      {
        tokens: 1,
        listeningHistory: { $slice: ["$listeningHistory", 1] },
        display_name: 1,
      }
    ).lean();

    const requests = users.map((user) =>
      cb(user).catch((err) => {
        console.log(`!${operation} [${user.display_name}]: ${err.message}`);
      })
    );

    await Promise.all(requests);

    const end = new Date();
    console.log(
      `${operation} [${requests.length}]: updated in ${timeDiff(
        start,
        end
      )} sec`
    );
  } catch (err) {
    console.error(`!${operation} [all]: ${err.message}`);
  }
}
