import formatTrack from "../includes/format-track.js";

test("empty track object", () => {
  expect(formatTrack({})).toEqual();
});

test("no track", () => {
  expect(formatTrack()).toEqual();
});

const mockTrack = {
  track: {
    album: {
      album_type: "single",
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/7lAi1Cv19DsukgGjbZQxFg",
          },
          href: "https://api.spotify.com/v1/artists/7lAi1Cv19DsukgGjbZQxFg",
          id: "7lAi1Cv19DsukgGjbZQxFg",
          name: "Annisokay",
          type: "artist",
          uri: "spotify:artist:7lAi1Cv19DsukgGjbZQxFg",
        },
      ],
      available_markets: ["AD", "AE", "AG", "AL", "AM", "AO", "AR"],
      external_urls: {
        spotify: "https://open.spotify.com/album/0seuamocLEL7ufV160iSxt",
      },
      href: "https://api.spotify.com/v1/albums/0seuamocLEL7ufV160iSxt",
      id: "0seuamocLEL7ufV160iSxt",
      images: [
        {
          height: 640,
          url:
            "https://i.scdn.co/image/ab67616d0000b2733a8e181c13547a2b34e55b59",
          width: 640,
        },
        {
          height: 300,
          url:
            "https://i.scdn.co/image/ab67616d00001e023a8e181c13547a2b34e55b59",
          width: 300,
        },
        {
          height: 64,
          url:
            "https://i.scdn.co/image/ab67616d000048513a8e181c13547a2b34e55b59",
          width: 64,
        },
      ],
      name: "The Cocaines Got Your Tongue",
      release_date: "2021-01-08",
      release_date_precision: "day",
      total_tracks: 1,
      type: "album",
      uri: "spotify:album:0seuamocLEL7ufV160iSxt",
    },
    artists: [
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/7lAi1Cv19DsukgGjbZQxFg",
        },
        href: "https://api.spotify.com/v1/artists/7lAi1Cv19DsukgGjbZQxFg",
        id: "7lAi1Cv19DsukgGjbZQxFg",
        name: "Annisokay",
        type: "artist",
        uri: "spotify:artist:7lAi1Cv19DsukgGjbZQxFg",
      },
    ],
    available_markets: ["AD", "AE", "AG", "AL"],
    disc_number: 1,
    duration_ms: 219820,
    explicit: false,
    external_ids: {
      isrc: "DEYO62000059",
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/1iSqp2xsP276WgQcoGXF2f",
    },
    href: "https://api.spotify.com/v1/tracks/1iSqp2xsP276WgQcoGXF2f",
    id: "1iSqp2xsP276WgQcoGXF2f",
    is_local: false,
    name: "The Cocaines Got Your Tongue",
    popularity: 34,
    preview_url:
      "https://p.scdn.co/mp3-preview/222a8cabbe7cd45f93f9f55bd105797e202a20ca?cid=774b29d4f13844c495f206cafdad9c86",
    track_number: 1,
    type: "track",
    uri: "spotify:track:1iSqp2xsP276WgQcoGXF2f",
  },
  played_at: "2021-05-19T04:25:15.929Z",
  context: {
    external_urls: {
      spotify: "https://open.spotify.com/playlist/127kpi6skLfbFLQc9EAtx5",
    },
    href: "https://api.spotify.com/v1/playlists/127kpi6skLfbFLQc9EAtx5",
    type: "playlist",
    uri: "spotify:playlist:127kpi6skLfbFLQc9EAtx5",
  },
};

const mockResponse = {
  id: "1iSqp2xsP276WgQcoGXF2f",
  name: "The Cocaines Got Your Tongue",
  duration_ms: 219820,
  popularity: 34,
  url: "https://open.spotify.com/track/1iSqp2xsP276WgQcoGXF2f",
  played_at: "2021-05-19T04:25:15.929Z",
  image: "https://i.scdn.co/image/ab67616d000048513a8e181c13547a2b34e55b59",
  album: {
    id: "0seuamocLEL7ufV160iSxt",
    name: "The Cocaines Got Your Tongue",
    url: "https://open.spotify.com/album/0seuamocLEL7ufV160iSxt",
  },
  context: {
    id: "127kpi6skLfbFLQc9EAtx5",
    url: "https://open.spotify.com/playlist/127kpi6skLfbFLQc9EAtx5",
  },
  artists: [
    {
      id: "7lAi1Cv19DsukgGjbZQxFg",
      name: "Annisokay",
      url: "https://open.spotify.com/artist/7lAi1Cv19DsukgGjbZQxFg",
    },
  ],
};

test("Mock data comparison", () => {
  expect(formatTrack(mockTrack)).toEqual(mockResponse);
});
