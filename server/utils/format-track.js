function formatTrack(item) {
  if (!item) return;

  const track = item.track;

  if (!item.track) return;

  const album = {
    id: track.album.id,
    name: track.album.name,
    url: track.album.external_urls.spotify,
  };

  let context = null;
  if (item.context && item.context.type === "playlist") {
    context = {
      id: item.context.uri.split(":")[2],
      url: item.context.external_urls.spotify,
    };
  }

  const artists = track.artists.map(({ id, name, external_urls }) => {
    return { id, name, url: external_urls.spotify };
  });

  return {
    id: track.id,
    name: track.name,
    duration_ms: track.duration_ms,
    url: track.external_urls.spotify,
    image:
      track.album.images && track.album.images.length
        ? track.album.images[2].url
        : "",
    album,
    plays: [{ played_at: item.played_at, context }],
    artists,
  };
}
export default formatTrack;
