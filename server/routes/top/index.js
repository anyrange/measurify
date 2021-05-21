/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";
import mongodb from "mongodb";
const { ObjectId } = mongodb;
import fetch from "node-fetch";

export default async function(fastify) {
  const auth = fastify.getSchema("auth");
  const top = fastify.getSchema("top");

  fastify.get(
    "/",
    {
      schema: {
        headers: auth,
        querystring: {
          type: "object",
          properties: {
            range: {
              type: "number",
              minimum: 1,
              maximum: 50,
            },
            firstDate: {
              type: "string",
              pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
            },
            lastDate: {
              type: "string",
              pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
            },
          },
        },
        response: { 200: top },
      },
      attachValidation: true,
    },
    async function(req, reply) {
      try {
        if (req.validationError) {
          const errorSource = req.validationError.validationContext;

          errorSource === "headers" &&
            reply.code(401).send({ message: "Unauthorized" });

          errorSource === "querystring" &&
            reply.code(417).send({ message: "Invalid parameters" });

          return;
        }

        const _id = req.headers.authorization;
        const range = req.query.range || 20;
        const firstDate = req.query.firstDate || "0000-00-00";
        let lastDate = req.query.lastDate || "9999-12-30";

        const document = await User.findOne(
          { _id },
          { recentlyPlayed: { $slice: ["$recentlyPlayed", 1] } }
        );

        if (!document)
          return reply.code(404).send({ message: "User not found" });

        if (!document.recentlyPlayed || !document.recentlyPlayed.length)
          return reply.code(204).send({});

        if (lastDate) {
          lastDate = new Date(lastDate);
          lastDate.setDate(lastDate.getDate() + 1);
          lastDate = lastDate.toISOString().split("T")[0];
        }
        if (new Date(firstDate) > new Date())
          return reply.code(417).send({ message: "Invalid parameters" });

        let response = {};

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

        const requests = info[3].map((playlist) => {
          return new Promise((resolve) => {
            addPlaylistInfo(playlist, resolve);
          }).then((res) => {
            if (!res) return;
            response.playlists.push(res);
          });
        });

        await Promise.all(requests);

        response.playlists.sort(function(a, b) {
          if (a.playtime < b.playtime) {
            return 1;
          }
          if (a.playtime > b.playtime) {
            return -1;
          }
          return 0;
        });

        const body = await fetch(
          `https://api.spotify.com/v1/artists?ids=${response.artists
            .map((artist) => artist.id)
            .join()}`,
          {
            headers: {
              Authorization: "Bearer " + response.artists[0].access_token,
            },
          }
        )
          .then((res) => res.json())
          .catch((err) => {
            throw err;
          });

        if (body.error)
          return reply.code(body.error.status || 500).send({
            message: body.error.message,
          });

        response.artists.forEach((artist, index) => {
          delete artist.access_token;
          artist.image =
            body.artists[index].images.length && body.artists[index].images[2]
              ? body.artists[index].images[2].url
              : "";
        });

        reply.code(200).send(response);
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!" });
        console.log(e);
      }
    }
  );
}

const tracks = async ({ _id, firstDate, lastDate, range }) => {
  const agg = [
    {
      $match: {
        _id: ObjectId(_id),
      },
    },
    {
      $project: {
        _id: 0,
        "recentlyPlayed.played_at": 1,
        "recentlyPlayed.image": 1,
        "recentlyPlayed.duration_ms": 1,
        "recentlyPlayed.id": 1,
        "recentlyPlayed.name": 1,
      },
    },
    {
      $unwind: {
        path: "$recentlyPlayed",
        includeArrayIndex: "arrayIndex",
      },
    },
    {
      $match: {
        "recentlyPlayed.played_at": {
          $gte: firstDate,
          $lte: lastDate,
        },
      },
    },
    {
      $group: {
        _id: {
          id: "$recentlyPlayed.id",
          name: "$recentlyPlayed.name",
          image: "$recentlyPlayed.image",
        },
        playtime: {
          $sum: "$recentlyPlayed.duration_ms",
        },
      },
    },
    {
      $sort: {
        playtime: -1,
      },
    },
    {
      $limit: range,
    },
  ];
  const tracks = await User.aggregate(agg);

  return tracks.map((track) => {
    return {
      id: track._id.id,
      image: track._id.image,
      name: track._id.name,
      playtime: Math.round(track.playtime / 1000 / 60),
    };
  });
};

const albums = async ({ _id, firstDate, lastDate, range }) => {
  const agg = [
    {
      $match: {
        _id: ObjectId(_id),
      },
    },
    {
      $project: {
        _id: 0,
        "recentlyPlayed.played_at": 1,
        "recentlyPlayed.album.id": 1,
        "recentlyPlayed.album.name": 1,
        "recentlyPlayed.image": 1,
        "recentlyPlayed.duration_ms": 1,
      },
    },
    {
      $unwind: {
        path: "$recentlyPlayed",
        includeArrayIndex: "arrayIndex",
      },
    },
    {
      $match: {
        "recentlyPlayed.played_at": {
          $gte: firstDate,
          $lte: lastDate,
        },
      },
    },
    {
      $group: {
        _id: {
          id: "$recentlyPlayed.album.id",
          name: "$recentlyPlayed.album.name",
          image: "$recentlyPlayed.image",
        },
        playtime: {
          $sum: "$recentlyPlayed.duration_ms",
        },
      },
    },
    {
      $sort: {
        playtime: -1,
      },
    },
    {
      $limit: range,
    },
  ];
  const albums = await User.aggregate(agg);

  return albums.map((track) => {
    return {
      id: track._id.id,
      image: track._id.image,
      name: track._id.name,
      playtime: Math.round(track.playtime / 1000 / 60),
    };
  });
};

const playlists = async ({ _id, firstDate, lastDate, range }) => {
  const agg = [
    {
      $match: {
        _id: ObjectId(_id),
      },
    },
    {
      $project: {
        _id: 0,
        "recentlyPlayed.played_at": 1,
        "recentlyPlayed.context": 1,
        "recentlyPlayed.duration_ms": 1,
        lastSpotifyToken: 1,
      },
    },
    {
      $unwind: {
        path: "$recentlyPlayed",
      },
    },
    {
      $match: {
        "recentlyPlayed.played_at": {
          $gte: firstDate,
          $lte: lastDate,
        },
        "recentlyPlayed.context": { $ne: null },
      },
    },
    {
      $group: {
        _id: {
          id: "$recentlyPlayed.context.id",
          access_token: "$lastSpotifyToken",
        },
        playtime: {
          $sum: "$recentlyPlayed.duration_ms",
        },
      },
    },
    {
      $sort: {
        playtime: -1,
      },
    },
    {
      $limit: range,
    },
  ];
  let playlists = await User.aggregate(agg);

  return playlists.map((track) => {
    return {
      id: track._id.id,
      access_token: track._id.access_token,
      playtime: Math.round(track.playtime / 1000 / 60),
    };
  });
};

const artists = async ({ _id, firstDate, lastDate, range }) => {
  const agg = [
    {
      $match: {
        _id: ObjectId(_id),
      },
    },
    {
      $project: {
        _id: 0,
        "recentlyPlayed.played_at": 1,
        "recentlyPlayed.artists.name": 1,
        "recentlyPlayed.artists.id": 1,
        "recentlyPlayed.duration_ms": 1,
        lastSpotifyToken: 1,
      },
    },
    {
      $unwind: {
        path: "$recentlyPlayed",
      },
    },
    {
      $match: {
        "recentlyPlayed.played_at": {
          $gte: firstDate,
          $lte: lastDate,
        },
      },
    },
    {
      $group: {
        _id: {
          id: { $arrayElemAt: ["$recentlyPlayed.artists.id", 0] },
          name: { $arrayElemAt: ["$recentlyPlayed.artists.name", 0] },
          access_token: "$lastSpotifyToken",
        },
        playtime: {
          $sum: "$recentlyPlayed.duration_ms",
        },
      },
    },
    {
      $sort: {
        playtime: -1,
      },
    },
    {
      $limit: range,
    },
  ];

  const artists = await User.aggregate(agg);
  return artists.map((track) => {
    return {
      id: track._id.id,
      name: track._id.name,
      access_token: track._id.access_token,
      playtime: Math.round(track.playtime / 1000 / 60),
    };
  });
};

const addPlaylistInfo = (playlist, cb) => {
  fetch(
    `https://api.spotify.com/v1/playlists/${playlist.id}?fields=images,name`,
    {
      headers: { Authorization: "Bearer " + playlist.access_token },
    }
  )
    .then((res) => res.json())
    .then((body) => {
      if (body.error) return cb();

      cb({
        name: body.name,
        id: playlist.id,
        image: body.images ? body.images[0].url : "",
        playtime: playlist.playtime,
      });
    })
    .catch(() => {
      cb();
    });
};
