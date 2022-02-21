export function addImage(item) {
  return Object.assign(item, {
    image: item.images.length ? item.images[0].url : "",
  });
}

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
  return arr.slice(-1)[0];
}

export function formatTrack(track) {
  const images = track.album.images;
  track.image = arrLastEl(images) || "";
  return track;
}
