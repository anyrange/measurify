import Track from "#server/models/Track.js";
import api from "#server/includes/api.js";
// import { arrLastEl, multipleRequests } from "#server/utils/index.js";

export default async (tracks, token) => {
  const uniqueTracks = [...new Set(tracks)];

  if (!uniqueTracks.length) return;

  const fullInfo = await api({
    route: `tracks?ids=${uniqueTracks.join(",")}`,
    token,
  }).then((res) =>
    res.tracks.map((track) => ({
      _id: track.id,
      name: track.name,
      album: track.album.id,
      image: track.album.images[1]?.url || track.album.images[0]?.url || "",
      artists: track.artists.map(({ id }) => id),
      duration_ms: track.duration_ms,
    }))
  );

  await Track.insertMany(fullInfo);
};
