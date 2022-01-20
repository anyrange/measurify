import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("userFriends", async (_id) => {
    let users = await fastify.db.User.aggregate()
      .match({ "tokens.refreshToken": { $ne: "" } })
      .project({
        track: { $first: "$listeningHistory.track" },
        lastPlayed: { $first: "$listeningHistory.played_at" },
        username: "$settings.username",
        "tokens.token": 1,
        display_name: 1,
        avatar: 1,
        lastLogin: 1,
      })
      .lookup({
        from: "tracks",
        localField: "track",
        foreignField: "_id",
        as: "lastTrack",
      })
      .addFields({ lastTrack: { $first: "$lastTrack" } })
      .lookup({
        from: "albums",
        localField: "lastTrack.album",
        foreignField: "_id",
        as: "lastTrack.album",
      })
      .addFields({ "lastTrack.album": { $first: "$lastTrack.album" } })
      .lookup({
        from: "artists",
        localField: "lastTrack.artists",
        foreignField: "_id",
        as: "lastTrack.artists",
      });

    // get requestor's info
    const requestor = users.find((user) => user._id === _id);

    if (!requestor) return [];

    // filter away requestor
    users = users.filter((user) => user._id != _id);

    if (!users.length) return [];

    const [followedList, ...mutualFollowedList] = await Promise.all([
      fastify.spotifyAPI({
        route: `me/following/contains?type=user&ids=${users
          .map(({ _id }) => _id)
          .join()}`,
        token: requestor.tokens.token,
      }),
      ...users.map((user) =>
        fastify.spotifyAPI({
          route: `me/following/contains?type=user&ids=${requestor._id}`,
          token: user.tokens.token,
        })
      ),
    ]);

    const friends = users.filter(
      (user, key) => mutualFollowedList[key][0] && followedList[key]
    );

    return friends;
  });
});

export default plugin;
