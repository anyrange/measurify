<template>
  <loading-spinner v-if="loading" />
  <template v-else>
    <info-message v-if="error" type="error" />
    <container v-else>
      <figure class="responsive-picture">
        <base-img
          parallax
          :src="albumData.album.image"
          :alt="albumData.album.name"
          image-type="album"
          class="responsive-picture__image"
        />
        <figcaption class="responsive-picture__title">
          <spotify-link
            :link="`https://open.spotify.com/album/${albumData.album.id}`"
          >
            {{ albumData.album.name }}
          </spotify-link>
        </figcaption>
      </figure>
      <cards>
        <card v-if="albumData.isLiked" title="❤">liked</card>
        <card :title="albumData.total_tracks">tracks amount</card>
      </cards>
      <container-item>
        <container-item-label>Audio features</container-item-label>
        <audio-features :audio-features="albumData.audioFeatures" />
      </container-item>
      <container-item v-if="albumData.genres.length">
        <container-item-label>Genres</container-item-label>
        <horizontal-scroll>
          <badge v-for="(genre, index) in albumData.genres" :key="index">
            {{ genre }}
          </badge>
        </horizontal-scroll>
      </container-item>
      <container-item>
        <container-item-label>Artists</container-item-label>
        <horizontal-scroll>
          <spotify-card
            v-for="item in albumData.album.artists"
            :key="item.id"
            :item="item"
            type="artist"
          />
        </horizontal-scroll>
      </container-item>
      <container-item v-if="tracksList.length">
        <container-item-label>Album content</container-item-label>
        <track-rows>
          <track-row
            v-for="(item, index) in tracksList"
            :key="index"
            plays-or-date="plays"
            :track="{
              ...item,
              album: false,
            }"
          />
        </track-rows>
      </container-item>
    </container>
  </template>
</template>

<script setup>
import { computed } from "vue";
import { useAlbum } from "@/composable/useAlbum";

const { albumData, loading, error } = useAlbum();

const tracksList = computed(() => {
  const combinedTracks = [
    ...albumData.value.content,
    ...albumData.value.favouriteTracks,
  ];
  let formattedTracks = [
    ...new Map(combinedTracks.map((item) => [item["id"], item])).values(),
  ];
  formattedTracks.map((track) => {
    if (!track.plays) track.plays = 0;
    if (!track.image) track.image = albumData.value.album.image;
  });
  formattedTracks.sort((a, b) => b.plays - a.plays);
  return formattedTracks;
});
</script>
