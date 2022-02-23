import Album from "#server/models/Album.js";
import api from "#server/includes/api.js";
import { arrLastEl } from "#server/utils/index.js";

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

  const fullInfo = await api({
    route: `albums?ids=${newAlbums.join(",")}`,
    token,
  }).then((res) =>
    res.albums.map((album) => ({
      _id: album.id,
      name: album.name,
      images: {
        highQuality: arrLastEl(album.images).url,
        lowQuality: album.images[0].url,
      },
    }))
  );

  await Album.insertMany(fullInfo);
};
