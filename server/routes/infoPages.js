const User = require("../models/User");
const fetch = require("node-fetch");
const { ObjectId } = require("mongodb");
const formatOverview = require("../includes/overview");

const infoPages = {
  artist: async (req, res) => {
    try {
      const _id = req.get("Authorization");
      const artistID = req.params.id;
      if (artistID.length !== 22) {
        res.status(404).json({ message: "Invalid artist" });
        return;
      }
      const user = await User.findOne({ _id }, { lastSpotifyToken: 1 });

      const body = await fetch(
        `https://api.spotify.com/v1/artists/${artistID}`,
        {
          headers: {
            Authorization: "Bearer " + user.lastSpotifyToken,
          },
        }
      );

      if (!body) {
        throw new Error("no response from spotify");
      }
      const json = await body.json();

      if (json.error) {
        throw new Error(json.error);
      }

      // get data for graph
      const rawPlays = await plays(_id, artistID);
      const overview = await formatOverview(rawPlays);
      if (!overview.length) {
        res.status(204).json({});
        return;
      }
      // response schema
      const response = {
        artist: {
          followers: json.followers.total,
          genres: json.genres,
          name: json.name,
          image: json.images.length ? json.images[0].url : "",
          link: json.external_urls.spotify,
        },
        overview,
        tracks: await history(_id, artistID),
      };
      res.status(200).json(response);
    } catch (e) {
      res.status(404).json();
      console.log(JSON.stringify(e));
    }
  },
  album: async (req, res) => {
    try {
      const _id = req.get("Authorization");
      const albumID = req.params.id;

      if (albumID.length !== 22) {
        res.status(404).json({ message: "Invalid album" });
        return;
      }
      const agg = [
        {
          $match: {
            _id: new ObjectId(_id),
          },
        },
        {
          $project: {
            _id: 0,
            "recentlyPlayed.track.artists.id": 1,
            "recentlyPlayed.track.album.name": 1,
            "recentlyPlayed.track.album.images.url": 1,
            "recentlyPlayed.track.album.external_urls.spotify": 1,
            "recentlyPlayed.track.album.id": 1,
            "recentlyPlayed.track.artists.name": 1,
            "recentlyPlayed.played_at": 1,
          },
        },
        {
          $unwind: {
            path: "$recentlyPlayed",
          },
        },
        {
          $match: {
            "recentlyPlayed.track.album.id": albumID,
          },
        },
        {
          $limit: 1,
        },
      ];

      const user = await User.aggregate(agg);
      if (!user.length) {
        res.status(204).json({});
        return;
      }
      const rawPlays = await plays(_id, albumID);
      const overview = await formatOverview(rawPlays);

      res.status(200).json({
        album: {
          name: user[0].recentlyPlayed.track.album.name,
          image: user[0].recentlyPlayed.track.album.images[0].url,
          link: user[0].recentlyPlayed.track.album.external_urls.spotify,
          artist: {
            name: user[0].recentlyPlayed.track.artists[0].name,
            id: user[0].recentlyPlayed.track.artists[0].id,
          },
        },
        overview,
        tracks: await history(_id, albumID),
      });
    } catch (e) {
      res.status(404).json();
      console.log(e);
    }
  },
  track: async (req, res) => {
    try {
      const _id = req.get("Authorization");
      const trackID = req.params.id;
      if (trackID.length !== 22) {
        res.status(404).json({ message: "Invalid track" });
        return;
      }
      const user = await User.findOne({ _id }, { lastSpotifyToken: 1 });

      const body = await fetch(`https://api.spotify.com/v1/tracks/${trackID}`, {
        headers: {
          Authorization: "Bearer " + user.lastSpotifyToken,
        },
      });

      if (!body) {
        throw new Error("no response from spotify");
      }
      const json = await body.json();

      if (json.error) {
        throw new Error(json.error);
      }

      // get data for graph
      const rawPlays = await plays(_id, trackID);
      const overview = await formatOverview(rawPlays);
      if (!overview.length) {
        res.status(204).json({});
        return;
      }
      let response = {
        track: {
          album: {
            name: json.album.name,
            id: json.album.id,
          },
          artist: {
            name: json.artists[0].name,
            id: json.artists[0].id,
          },
          name: json.name,
          image: json.album.images[0].url,
          link: json.external_urls.spotify,
          duration_ms: json.duration_ms,
          release: json.album.release_date,
        },
        overview,
      };

      res.status(200).json(response);
    } catch (e) {
      res.status(404).json();
      console.log(JSON.stringify(e));
    }
  },
};

const history = async (_id, filterId) => {
  try {
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
          "recentlyPlayed.track.artists.id": 1,
          "recentlyPlayed.track.album.id": 1,
          "recentlyPlayed.track.duration_ms": 1,
          "recentlyPlayed.track.id": 1,
          "recentlyPlayed.track.name": 1,
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
          $or: [
            { "recentlyPlayed.track.artists.id": filterId },
            { "recentlyPlayed.track.album.id": filterId },
          ],
        },
      },
      {
        $group: {
          _id: {
            id: "$recentlyPlayed.track.id",
            name: "$recentlyPlayed.track.name",
          },
          playtime: {
            $sum: "$recentlyPlayed.track.duration_ms",
          },
        },
      },
      {
        $sort: {
          playtime: -1,
        },
      },
      {
        $limit: 20,
      },
    ];
    const tracks = await User.aggregate(agg);
    return tracks.map((track) => {
      return {
        id: track._id.id,
        name: track._id.name,
        playtime: Math.round(track.playtime / 1000 / 60),
      };
    });
  } catch (e) {
    console.log(JSON.stringify(e));
  }
};

const plays = async (id, filterId) => {
  try {
    const agg = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $project: {
          _id: 0,
          "recentlyPlayed.track.id": 1,
          "recentlyPlayed.track.artists.id": 1,
          "recentlyPlayed.track.album.id": 1,
          "recentlyPlayed.track.duration_ms": 1,
          "recentlyPlayed.played_at": 1,
        },
      },
      {
        $unwind: {
          path: "$recentlyPlayed",
        },
      },
      {
        $match: {
          $or: [
            { "recentlyPlayed.track.artists.id": filterId },
            { "recentlyPlayed.track.album.id": filterId },
            { "recentlyPlayed.track.id": filterId },
          ],
        },
      },
      {
        $addFields: {
          "recentlyPlayed.played_at": {
            $toDate: "$recentlyPlayed.played_at",
          },
        },
      },
      {
        $project: {
          "recentlyPlayed.track.duration_ms": 1,
          "recentlyPlayed.played_at": {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$recentlyPlayed.played_at",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            date: "$recentlyPlayed.played_at",
          },
          plays: {
            $sum: 1,
          },
          playtime: {
            $sum: "$recentlyPlayed.track.duration_ms",
          },
        },
      },
      {
        $sort: {
          "_id.date": -1,
        },
      },
    ];
    return await User.aggregate(agg);
  } catch (e) {
    console.log(JSON.stringify(e));
  }
};

module.exports = infoPages;
