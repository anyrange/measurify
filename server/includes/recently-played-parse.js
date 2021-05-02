const fetch = require("node-fetch");
const TopAlbums = require("../models/TopAlbums");
const TopTracks = require("../models/TopTracks");
const TopPlaylists = require("../models/TopPlaylists");
const TopArtists = require("../models/TopArtists");
const User = require("../models/User");

require("dotenv").config();

function refresh_recently_played() {
  const start = new Date();
  const agg = [
    {
      $project: {
        spotifyID: 1,
        lastSpotifyToken: 1,
        listeningHistory: {
          $slice: ["$listeningHistory", 1],
        },
        userName: 1,
      },
    },
    {
      $project: {
        spotifyID: 1,
        lastSpotifyToken: 1,
        userName: 1,
        "listeningHistory.played_at": 1,
      },
    },
  ];
  User.aggregate(agg, (err, users) => {
    if (err) {
      console.log(err);
      return;
    }

    // ## PARALLEL EXECUTION (TASKS MAY BE EXECUTED IN RANDOM ORDER)

    let requests = users.map((user) => {
      return new Promise((resolve, reject) => {
        parseRecentlyPlayed(user, resolve, reject);
      }).catch((user, error) => {
        console.log(user + " died");
        console.log("message: " + error);
      });
    });

    Promise.all(requests).then(() => {
      const end = new Date();
      console.log(
        `All ${requests.length} histories updated in ${(
          (end.getTime() - start.getTime()) /
          1000
        ).toFixed(2)} sec [${new Date().toLocaleString("en-US", {
          timeZone: "Asia/Almaty",
        })}]`
      );
    });
  });

  function parseRecentlyPlayed(user, cb, reject) {
    fetch("https://api.spotify.com/v1/me/player/recently-played?limit=15", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user.lastSpotifyToken,
      },
    })
      .then(async (body) => {
        if (!body) return;
        body = await body.json();

        if (body.error) {
          reject(user.userName, body.error);
          return;
        }

        if (!body.items.length || !user) {
          cb();
          return;
        }

        if (!user.listeningHistory || !user.listeningHistory.length) {
          const listeningHistory = body.items.map((track) =>
            formatTrack(track)
          );
          body.items.forEach((track) => {
            addToTops(track, user);
          });
          await User.updateOne({ _id: user._id }, { listeningHistory });

          cb();
          return;
        }

        let i = 0;
        const listenedTracks = [];
        const lastListenedTrackDate = user.listeningHistory[0].played_at.toISOString();

        while (
          lastListenedTrackDate < body.items[i].played_at &&
          i < body.items.length
        ) {
          const play = body.items[i];
          listenedTracks.push(formatTrack(play));
          addToTops(play, user);
          i++;
        }

        const query = { spotifyID: user.spotifyID };
        const update = {
          $push: {
            listeningHistory: {
              $each: listenedTracks,
              $position: 0,
            },
          },
        };
        await User.updateOne(query, update);
        cb();
      })
      .catch((err) => {
        reject(user.userName, err.message);
      });
  }

  function formatTrack(item) {
    const track = item.track;
    const album = { id: track.album.id, name: track.album.name };
    let context = null;
    if (item.context && item.context.type === "playlist") {
      context = item.context.uri.split(":")[2];
    }
    const artists = track.artists.map(({ id, name }) => {
      return { id, name };
    });
    return {
      id: track.id,
      name: track.name,
      duration_ms: track.duration_ms,
      popularity: track.popularity,
      played_at: new Date(item.played_at),
      album,
      context,
      artists,
    };
  }

  async function addToTops(play, user) {
    topAlbum(play, user);
    topTrack(play, user);
    if (play.context && play.context.type === "playlist") {
      topPlaylist(play, user);
    }
    topArtists(play, user);
  }
  async function topPlaylist(play, user) {
    const playlist = await TopPlaylists.findOne({
      user: user._id,
      id: play.context.uri.split(":")[2],
    });

    if (!playlist) {
      let playlistInfo = await fetch(
        `https://api.spotify.com/v1/playlists/${
          play.context.uri.split(":")[2]
        }?fields=images,name`,
        {
          headers: { Authorization: `Bearer ${user.lastSpotifyToken}` },
        }
      );
      playlistInfo = await playlistInfo.json();
      await TopPlaylists.create({
        user: user._id,
        id: play.context.uri.split(":")[2],
        name: playlistInfo.name,
        image: playlistInfo.images ? playlistInfo.images[0].url : "",
        playtime: play.track.duration_ms,
      });
    } else {
      await TopPlaylists.updateOne(
        {
          user: user._id,
          id: play.context.uri.split(":")[2],
        },
        { $inc: { playtime: play.track.duration_ms } }
      );
    }
  }
  async function topArtists(play, user) {
    play.track.artists.forEach(async (artist) => {
      const artistDB = await TopArtists.findOne({
        user: user._id,
        id: artist.id,
      });
      if (!artistDB) {
        let artistInfo = await fetch(
          `https://api.spotify.com/v1/artists/${artist.id}`,
          {
            headers: { Authorization: `Bearer ${user.lastSpotifyToken}` },
          }
        );
        artistInfo = await artistInfo.json();

        await TopArtists.create({
          user: user._id,
          id: artist.id,
          name: artist.name,
          image: artistInfo.images ? artistInfo.images[2].url : "",
          playtime: play.track.duration_ms,
        });
      } else {
        await TopArtists.updateOne(
          {
            user: user._id,
            id: artist.id,
          },
          { $inc: { playtime: play.track.duration_ms } }
        );
      }
    });
  }
  async function topTrack(play, user) {
    await TopTracks.updateOne(
      {
        user: user._id,
        id: play.track.id,
        name: play.track.name,
        image: play.track.album.images ? play.track.album.images[2].url : "",
        duration: play.track.duration_ms,
        album: { id: play.track.album.id, name: play.track.album.name },
        artists: play.track.artists.map(({ id, name }) => {
          return { id, name };
        }),
      },
      {
        $inc: { plays: 1, playtime: play.track.duration_ms },
        lastPlayed: new Date(play.played_at),
      },
      { upsert: true }
    );
  }
  async function topAlbum(play, user) {
    await TopAlbums.updateOne(
      {
        user: user._id,
        id: play.track.album.id,
        name: play.track.album.name,
        image: play.track.album.images ? play.track.album.images[2].url : "",
      },
      { $inc: { playtime: play.track.duration_ms } },
      { upsert: true }
    );
  }
}

module.exports = refresh_recently_played;
