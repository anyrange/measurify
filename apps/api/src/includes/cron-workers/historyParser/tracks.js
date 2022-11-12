import Track from "#src/models/Track.js"
import api from "#src/includes/api.js"
import parseFeatures from "#src/includes/parseAudioFeatures.js"
import getRandomToken from "#src/includes/getRandomToken.js"
import { arrLastEl } from "#src/utils/index.js"
import { addArtist } from "#src/includes/cron-workers/historyParser/artists.js"
import { addAlbum } from "#src/includes/cron-workers/historyParser/albums.js"

export default async (tracks) => {
  const trackIds = tracks.map((track) => track.id)

  const uniqueTracks = [...new Set(trackIds)]

  if (!uniqueTracks.length) return

  const existingTracks = await Track.find(
    { _id: { $in: uniqueTracks } },
    "_id"
  ).lean()

  const newTracks = tracks.filter(
    (track) =>
      !existingTracks.find((existingTrack) => track.id === existingTrack._id)
  )

  if (!newTracks.length) return

  const bulk = newTracks.map((track) => createTrackBulk(track))

  await Track.bulkWrite(bulk)
}

const createTrackBulk = (track) => ({
  updateOne: {
    filter: { _id: track.id },
    update: {
      name: track.name,
      duration_ms: track.duration_ms,
      album: track.album.id,
      release_date: track.album.release_date,
      artists: track.artists.map(({ id }) => id),
      images: {
        highQuality: track.album.images[0]?.url,
        mediumQuality: track.album.images[1]?.url || track.album.images[0]?.url,
        lowQuality: arrLastEl(track.album.images)?.url,
      },
    },
    upsert: true,
  },
})

export const addTrack = async (trackID, token) => {
  const usableToken = token || (await getRandomToken())

  const [track, audioFeatures] = await Promise.all([
    api({
      route: `tracks/${trackID}`,
      token: usableToken,
    }),
    parseFeatures([trackID], usableToken),
  ])

  audioFeatures.popularity = track.popularity / 100

  const images = track.album.images
  const newItem = {
    name: track.name,
    duration_ms: track.duration_ms,
    album: track.album.id,
    artists: track.artists.map(({ id }) => id),
    images: {
      highQuality: images[0]?.url,
      mediumQuality: images[1]?.url || images[0]?.url,
      lowQuality: arrLastEl(images)?.url,
    },
    audioFeatures,
    release_date: track.album.release_date,
  }

  const [, album, ...artists] = await Promise.all([
    Track.updateOne({ _id: trackID }, newItem, { upsert: true }),
    addAlbum(track.album.id),
    ...track.artists.map((artist) => addArtist(artist.id)),
  ])
  newItem.album = album
  newItem.artists = artists
  newItem._id = trackID

  return newItem
}
