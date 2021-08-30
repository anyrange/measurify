const formatTrack = (track) => {
  const images = track.album.images;
  track.image = images[1].url || images[0].url || "";
  return track;
};

export default formatTrack;
