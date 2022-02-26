import Track from "#server/models/Track.js";
import api from "#server/includes/api.js";
import parseFeatures from "#server/includes/parseAudioFeatures.js";
import getRandomToken from "#server/includes/getRandomToken.js";
import { arrLastEl } from "#server/utils/index.js";
import { addArtist } from "#server/includes/cron-workers/historyParser/artists.js";
import { addAlbum } from "#server/includes/cron-workers/historyParser/albums.js";

export default async (tracks, token) => {
  const trackIds = tracks.map((track) => track.id);

  const uniqueTracks = [...new Set(trackIds)];

  if (!uniqueTracks.length) return;

  const existingTracks = await Track.find(
    { _id: { $in: uniqueTracks } },
    "_id"
  ).lean();

  const newTracks = tracks.filter(
    (track) =>
      !existingTracks.find((existingTrack) => track.id === existingTrack._id)
  );

  if (!newTracks.length) return;

  const bulk = [];

  await Promise.allSettled(
    newTracks.map(async (track) => {
      bulk.push(await createTrackBulk(track, token));
    })
  );

  await Track.bulkWrite(bulk);
};

export const addTrack = async (trackID, token) => {
  const usableToken = token || (await getRandomToken());

  const track = await api({
    route: `tracks/${trackID}`,
    token: usableToken,
  });

  const bulk = [await createTrackBulk(track, usableToken)];
  const [, album, ...artists] = await Promise.all([
    Track.bulkWrite(bulk),
    addAlbum(track.album.id),
    ...track.artists.map((artist) => addArtist(artist.id)),
  ]);

  const addedTrack = bulk[0].updateOne.update["$set"];
  addedTrack.id = trackID;
  addedTrack.album = album;
  addedTrack.artists = artists;

  return addedTrack;
};

const createTrackBulk = async (track, token) => {
  const audioFeatures = await parseFeatures([track.id], token);

  audioFeatures.popularity = track.popularity / 100;

  return {
    updateOne: {
      filter: { _id: track.id },
      update: {
        name: track.name,
        duration_ms: track.duration_ms,
        album: track.album.id,
        artists: track.artists.map(({ id }) => id),
        images: {
          highQuality: track.album.images[0]?.url,
          mediumQuality:
            track.album.images[1]?.url || track.album.images[0]?.url,
          lowQuality: arrLastEl(track.album.images)?.url,
        },
        audioFeatures,
      },
      upsert: true,
    },
  };
};
