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

  const bulk = [];

  await Promise.allSettled(
    fullInfo.map(async (album) => {
      bulk.push(await createAlbumBulk(album, token));
    })
  );

  await Album.bulkWrite(bulk);
};

export const addAlbum = async (albumID, token) => {
  const usableToken = token || (await getRandomToken());

  const album = await api({
    route: `albums/${albumID}`,
    token: usableToken,
  });

  const bulk = [await createAlbumBulk(album, usableToken)];
  await Album.bulkWrite(bulk);

  return bulk[0].updateOne.update["$set"];
};

const createAlbumBulk = async (album, token) => {
  const audioFeatures = await parseFeatures(
    album.tracks.items.map(({ id }) => id),
    token
  );

  audioFeatures.popularity = album.popularity / 100;

  return {
    updateOne: {
      filter: { _id: album.id },
      update: {
        images: {
          highQuality: album.images[0].url || "",
          lowQuality: arrLastEl(album.images).url,
        },
        name: album.name,
        audioFeatures,
        genres: album.genres,
        release_date: album.release_date,
        total_tracks: album.total_tracks,
        label: album.label,
      },
      upsert: true,
    },
  };
};
