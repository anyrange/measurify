import Artist from "#src/models/Artist.js"
import api from "#src/includes/api.js"
import parseFeatures from "#src/includes/parseAudioFeatures.js"
import getRandomToken from "#src/includes/getRandomToken.js"
import { arrLastEl, multipleRequests } from "#src/utils/index.js"

export default async (artists, token) => {
  const uniqueArtists = [...new Set(artists)]

  const existingArtists = await Artist.find(
    { _id: { $in: uniqueArtists } },
    "_id"
  ).lean()

  const newArtists = uniqueArtists.filter(
    (id) => !existingArtists.find((existingArtist) => id === existingArtist._id)
  )

  if (!newArtists.length) return

  const responses = await multipleRequests(newArtists, (chunk) =>
    api({ route: `artists?ids=${chunk}`, token })
  )

  const fullInfo = responses.map((res) => res.artists).flat(1)

  const bulk = fullInfo.map((artist) => createArtistBulk(artist))

  await Artist.bulkWrite(bulk)
}

const createArtistBulk = (artist) => ({
  updateOne: {
    filter: { _id: artist.id },
    update: {
      name: artist.name,
      genres: artist.genres,
      images: {
        highQuality: artist.images[0]?.url,
        mediumQuality: artist.images[1]?.url || artist.images[0]?.url,
        lowQuality: arrLastEl(artist.images)?.url,
      },
      followers: artist.followers.total,
    },
    upsert: true,
  },
})

export const addArtist = async (artistID, token) => {
  const usableToken = token || (await getRandomToken())

  const [artist, audioFeatures] = await Promise.all([
    api({
      route: `artists/${artistID}`,
      token: usableToken,
    }),
    api({
      route: `artists/${artistID}/top-tracks?market=US`,
      token: usableToken,
    }).then(({ tracks }) =>
      parseFeatures(
        tracks.map((track) => track.id),
        usableToken
      )
    ),
  ])

  audioFeatures.popularity = artist.popularity / 100

  const images = artist.images

  const newItem = {
    name: artist.name,
    genres: artist.genres,
    images: {
      highQuality: images[0]?.url,
      mediumQuality: images[1]?.url || images[0]?.url,
      lowQuality: arrLastEl(images)?.url,
    },
    audioFeatures,
    followers: artist.followers.total,
  }

  Artist.updateOne({ _id: artistID }, newItem, { upsert: true }).then()

  newItem._id = artistID
  return newItem
}
