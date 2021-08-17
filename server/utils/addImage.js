export default function (item) {
  return Object.assign(item, {
    image: item.images.length ? item.images[0].url : "",
  });
}
