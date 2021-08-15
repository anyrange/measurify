import fp from "fastify-plugin";
import User from "../../../models/User.js";
import mongodb from "mongodb";

const { ObjectId } = mongodb;

const plugin = fp(async function plugin(fastify) {
  fastify.decorate(
    "parseTop",
    async (
      _id,
      access_token,
      range = 20,
      firstDate = "0000-00-00",
      lastDate = "9999-12-30"
    ) => {
      const response = { tracks: [], albums: [], playlists: [], artists: [] };

      const options = { _id, firstDate, lastDate, range };
      const info = await Promise.all([
        tracks(options),
        albums(options),
        artists(options),
        playlists(options),
      ]);

      response.tracks = info[0];
      response.albums = info[1];
      response.artists = info[2];
      response.playlists = [];

      const requests = info[3].map(
        (playlist) =>
          new Promise(async (resolve) => {
            const body = await fastify.spotifyAPI({
              route: `playlists/${playlist.id}?fields=images,name`,
              token: playlist.access_token,
            });

            response.playlists.push({
              name: body.name,
              id: playlist.id,
              image: body.images?.length ? body.images[0].url : "",
              plays: playlist.plays,
            });
            resolve();
          })
      );

      await Promise.all(requests);
      response.playlists.sort(function (a, b) {
        if (a.plays < b.plays) {
          return 1;
        }
        if (a.plays > b.plays) {
          return -1;
        }
        return 0;
      });

      const body = response.artists.length
        ? await fastify.spotifyAPI({
            route: `artists?ids=${response.artists
              .map((artist) => artist.id)
              .join()}`,
            token: access_token,
          })
        : [];

      if (!body.error) {
        response.artists.forEach((artist, index) => {
          artist.image =
            body.artists[index].images.length && body.artists[index].images[2]
              ? body.artists[index].images[2].url
              : "";
        });
      }

      return response;
    }
  );
});

const tracks = async ({ _id, firstDate, lastDate, range }) => {
  const agg = [
    { $match: { _id: ObjectId(_id) } },
    {
      $project: {
        "recentlyPlayed.plays.played_at": 1,
        "recentlyPlayed.image": 1,
        "recentlyPlayed.id": 1,
        "recentlyPlayed.name": 1,
      },
    },
    { $unwind: { path: "$recentlyPlayed" } },
    { $unwind: { path: "$recentlyPlayed.plays" } },
    {
      $project: {
        "recentlyPlayed.duration_ms": 1,
        "recentlyPlayed.id": 1,
        "recentlyPlayed.name": 1,
        "recentlyPlayed.image": 1,
        "recentlyPlayed.played_at": "$recentlyPlayed.plays.played_at",
      },
    },
    {
      $match: {
        "recentlyPlayed.played_at": { $gte: firstDate, $lte: lastDate },
      },
    },
    {
      $group: {
        _id: {
          id: "$recentlyPlayed.id",
          name: "$recentlyPlayed.name",
          image: "$recentlyPlayed.image",
        },
        plays: { $sum: 1 },
      },
    },
    { $sort: { plays: -1 } },
    { $limit: range },
  ];

  const tracks = await User.aggregate(agg);

  return tracks.map((track) => {
    return {
      id: track._id.id,
      image: track._id.image,
      name: track._id.name,
      plays: track.plays,
    };
  });
};

const albums = async ({ _id, firstDate, lastDate, range }) => {
  const agg = [
    { $match: { _id: ObjectId(_id) } },
    {
      $project: {
        _id: 0,
        "recentlyPlayed.plays.played_at": 1,
        "recentlyPlayed.album.id": 1,
        "recentlyPlayed.album.name": 1,
        "recentlyPlayed.image": 1,
      },
    },
    { $unwind: { path: "$recentlyPlayed" } },
    { $unwind: { path: "$recentlyPlayed.plays" } },
    {
      $project: {
        "recentlyPlayed.album.id": 1,
        "recentlyPlayed.album.name": 1,
        "recentlyPlayed.image": 1,
        "recentlyPlayed.played_at": "$recentlyPlayed.plays.played_at",
      },
    },
    {
      $match: {
        "recentlyPlayed.played_at": { $gte: firstDate, $lte: lastDate },
      },
    },
    {
      $group: {
        _id: {
          id: "$recentlyPlayed.album.id",
          name: "$recentlyPlayed.album.name",
          image: "$recentlyPlayed.image",
        },
        plays: { $sum: 1 },
      },
    },
    { $sort: { plays: -1 } },
    { $limit: range },
  ];
  const albums = await User.aggregate(agg);

  return albums.map((track) => {
    return {
      id: track._id.id,
      image: track._id.image,
      name: track._id.name,
      plays: track.plays,
    };
  });
};

const playlists = async ({ _id, firstDate, lastDate, range }) => {
  const agg = [
    { $match: { _id: ObjectId(_id) } },
    {
      $project: {
        _id: 0,
        "recentlyPlayed.plays.played_at": 1,
        "recentlyPlayed.plays.context": 1,
        lastSpotifyToken: 1,
      },
    },
    { $unwind: { path: "$recentlyPlayed" } },
    { $unwind: { path: "$recentlyPlayed.plays" } },
    {
      $project: {
        "recentlyPlayed.context": "$recentlyPlayed.plays.context",
        lastSpotifyToken: 1,
        "recentlyPlayed.played_at": "$recentlyPlayed.plays.played_at",
      },
    },
    {
      $match: {
        "recentlyPlayed.played_at": { $gte: firstDate, $lte: lastDate },
        "recentlyPlayed.context": { $ne: null },
      },
    },
    {
      $group: {
        _id: {
          id: "$recentlyPlayed.context.id",
          access_token: "$lastSpotifyToken",
        },
        plays: { $sum: 1 },
      },
    },
    { $sort: { plays: -1 } },
    { $limit: range },
  ];
  let playlists = await User.aggregate(agg);

  return playlists.map((track) => {
    return {
      id: track._id.id,
      access_token: track._id.access_token,
      plays: track.plays,
    };
  });
};

const artists = async ({ _id, firstDate, lastDate, range }) => {
  const agg = [
    { $match: { _id: ObjectId(_id) } },
    {
      $project: {
        _id: 0,
        "recentlyPlayed.plays.played_at": 1,
        "recentlyPlayed.artists.name": 1,
        "recentlyPlayed.artists.id": 1,
      },
    },
    { $unwind: { path: "$recentlyPlayed" } },
    { $unwind: { path: "$recentlyPlayed.plays" } },
    {
      $project: {
        "recentlyPlayed.artists.name": 1,
        "recentlyPlayed.artists.id": 1,
        "recentlyPlayed.played_at": "$recentlyPlayed.plays.played_at",
      },
    },
    {
      $match: {
        "recentlyPlayed.played_at": { $gte: firstDate, $lte: lastDate },
      },
    },
    {
      $group: {
        _id: {
          id: { $arrayElemAt: ["$recentlyPlayed.artists.id", 0] },
          name: { $arrayElemAt: ["$recentlyPlayed.artists.name", 0] },
          access_token: "$lastSpotifyToken",
        },
        plays: { $sum: 1 },
      },
    },
    { $sort: { plays: -1 } },
    { $limit: range },
  ];

  const artists = await User.aggregate(agg);
  return artists.map((track) => {
    return {
      id: track._id.id,
      name: track._id.name,
      plays: track.plays,
    };
  });
};

export default plugin;
