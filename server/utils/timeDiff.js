/**
 *
 * @param {Date} start
 * @param {Date} end
 * @returns {string}
 */

export default function (start, end) {
  return ((end.getTime() - start.getTime()) / 1000).toFixed(2);
}
