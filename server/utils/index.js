/**
 *
 * @param {Date} start
 * @param {Date} end
 * @returns {string}
 */

export function timeDiff(start, end) {
  return ((end.getTime() - start.getTime()) / 1000).toFixed(2);
}

export function arrLastEl(arr) {
  if (!arr?.length) return null;
  return arr.slice(-1)[0];
}

export function formatTrack(track) {
  const images = track.album.images;
  track.image = arrLastEl(images)?.url || "";
  return track;
}

export function addImage(item, quality = 0) {
  item.image = item.images[quality]?.url || item.images[0]?.url || "";
  return item;
}

const CHUNK_SIZE = 20;

export async function multipleRequests(ids, cb) {
  const chunks = [];

  for (let i = 0; i < Math.ceil(ids.length / CHUNK_SIZE); i++) {
    const sliceStart = i * CHUNK_SIZE;
    chunks.push(ids.slice(sliceStart, sliceStart + CHUNK_SIZE).join(","));
  }

  const responses = await Promise.all(chunks.map((chunk) => cb(chunk)));

  return responses;
}

export function getMonday() {
  let d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day == 0 ? -6 : 1);

  return new Date(d.setDate(diff));
}
