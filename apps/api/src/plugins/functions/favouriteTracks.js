import fp from "fastify-plugin"

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("favouriteTracks", ({ _id, filterID, type }) => {
    const agg = [
      { $match: { _id } },
      { $project: { listeningHistory: 1 } },
      { $unwind: { path: "$listeningHistory" } },
      {
        $group: {
          _id: "$listeningHistory.track",
          plays: { $sum: 1 },
          lastPlayedAt: { $max: "$listeningHistory.played_at" },
        },
      },
      {
        $lookup: {
          from: "tracks",
          localField: "_id",
          foreignField: "_id",
          as: "tracks",
        },
      },
    ]

    if (type === "album") agg.push({ $match: { "tracks.album": filterID } })
    if (type === "artist") agg.push({ $match: { "tracks.artists": filterID } })

    agg.push(
      {
        $lookup: {
          from: "albums",
          localField: "tracks.album",
          foreignField: "_id",
          as: "albums",
        },
      },
      {
        $lookup: {
          from: "artists",
          localField: "tracks.artists",
          foreignField: "_id",
          as: "artists",
        },
      },
      {
        $addFields: {
          id: "$_id",
          name: { $first: "$tracks.name" },
          duration_ms: { $first: "$tracks.duration_ms" },
          image: { $first: "$tracks.images.mediumQuality" },
          album: {
            id: { $first: "$albums._id" },
            name: { $first: "$albums.name" },
            image: { $first: "$albums.images.lowQuality" },
          },
          artists: {
            $map: {
              input: "$artists",
              as: "artist",
              in: {
                id: "$$artist._id",
                name: "$$artist.name",
                image: "$$artist.images.lowQuality",
              },
            },
          },
        },
      },
      { $sort: { plays: -1, name: 1 } }
    )

    return fastify.db.User.aggregate(agg)
  })
})

export default plugin
