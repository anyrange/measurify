import Artist from "#server/models/Artist.js";
import api from "#server/includes/api.js";
import parseFeatures from "#server/includes/parseAudioFeatures.js";
import getRandomToken from "#server/includes/getRandomToken.js";
import { arrLastEl, multipleRequests } from "#server/utils/index.js";

export default async (artists, token) => {
  const uniqueArtists = [...new Set(artists)];

  const existingArtists = await Artist.find(
    { _id: { $in: uniqueArtists } },
    "_id"
  ).lean();

  const newArtists = uniqueArtists.filter(
    (id) => !existingArtists.find((existingArtist) => id === existingArtist._id)
  );

  if (!newArtists.length) return;

  const responses = await multipleRequests(newArtists, (chunk) =>
    api({ route: `artists?ids=${chunk}`, token })
  );

  const fullInfo = responses.map((res) => res.artists).flat(1);

  const bulk = [];

  await Promise.allSettled(
    fullInfo.map(async (artist) => {
      bulk.push(await createArtistBulk(artist, token));
    })
  );

  await Artist.bulkWrite(bulk);
};

export const addArtist = async (artistID, token) => {
  const usableToken = token || (await getRandomToken());

  const artist = await api({
    route: `artists/${artistID}`,
    token: usableToken,
  });

  const bulk = [await createArtistBulk(artist, usableToken)];
  await Artist.bulkWrite(bulk);

  const addedArtist = bulk[0].updateOne.update["$set"];
  addedArtist.id = artistID;

  return addedArtist;
};

const createArtistBulk = async (artist, token) => {
  const audioFeatures = await api({
    route: `artists/${artist.id}/top-tracks?market=US`,
    token,
  }).then(({ tracks }) =>
    parseFeatures(
      tracks.map((track) => track.id),
      token
    )
  );

  audioFeatures.popularity = artist.popularity / 100;

  return {
    updateOne: {
      filter: { _id: artist.id },
      update: {
        name: artist.name,
        genres: artist.genres,
        images: {
          highQuality: artist.images[0]?.url,
          lowQuality: arrLastEl(artist.images)?.url,
        },
        audioFeatures,
        followers: artist.followers.total,
      },
      upsert: true,
    },
  };
};
