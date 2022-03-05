import Album from "#server/models/Album.js";
import api from "#server/includes/api.js";
import parseFeatures from "#server/includes/parseAudioFeatures.js";
import getRandomToken from "#server/includes/getRandomToken.js";
import { arrLastEl, multipleRequests } from "#server/utils/index.js";

export default async (albums, token) => {
  const uniqueAlbums = [...new Set(albums)];

  const existingAlbums = await Album.find(
    { _id: { $in: uniqueAlbums } },
    "_id"
  ).lean();

  const newAlbums = uniqueAlbums.filter(
    (id) => !existingAlbums.find((existingAlbum) => id === existingAlbum._id)
  );

  if (!newAlbums.length) return;

  const responses = await multipleRequests(newAlbums, (chunk) =>
    api({ route: `albums?ids=${chunk}`, token })
  );

  const fullInfo = responses.map((res) => res.albums).flat(1);

  const bulk = fullInfo.map((album) => createAlbumBulk(album));

  await Album.bulkWrite(bulk);
};

const createAlbumBulk = (album) => ({
  updateOne: {
    filter: { _id: album.id },
    update: {
      images: {
        highQuality: album.images[0]?.url,
        mediumQuality: album.images[1]?.url || album.images[0]?.url,
        lowQuality: arrLastEl(album.images)?.url,
      },
      name: album.name,
      genres: album.genres,
      release_date: album.release_date,
      total_tracks: album.total_tracks,
      label: album.label,
    },
    upsert: true,
  },
});

export const addAlbum = async (albumID, token) => {
  const usableToken = token || (await getRandomToken());

  const album = await api({
    route: `albums/${albumID}`,
    token: usableToken,
  });

  const audioFeatures = await parseFeatures(
    album.tracks.items.map(({ id }) => id),
    usableToken
  );

  audioFeatures.popularity = album.popularity / 100;

  const images = album.images;
  const newItem = {
    images: {
      highQuality: images[0]?.url,
      mediumQuality: images[1]?.url || images[0]?.url,
      lowQuality: arrLastEl(album.images)?.url,
    },
    name: album.name,
    audioFeatures,
    genres: album.genres,
    release_date: album.release_date,
    total_tracks: album.total_tracks,
    label: album.label,
  };

  Album.updateOne({ _id: albumID }, newItem, { upsert: true }).then();
  newItem._id = albumID;
  return newItem;
};
