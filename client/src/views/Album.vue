<template>
  <template v-if="!loading">
    <container>
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
      <suspense>
        <album-content
          :album-id="albumData.album.id"
          :favourite-tracks="albumData.favouriteTracks"
        />
        <template #fallback>
          <track-rows>
            <track-row-skeleton
              v-for="track in albumData.total_tracks"
              :key="track"
            />
          </track-rows>
        </template>
      </suspense>
    </container>
  </template>
  <template v-else>
    <loading-spinner />
  </template>
</template>

<script setup>
import { computed, watch, ref } from "vue";
import { useRoute } from "vue-router";
import { useTitle } from "@vueuse/core";
import { createAsyncProcess } from "@/composable/useAsync";
import { getAlbum, getAlbumArtists } from "@/api";

const route = useRoute();
const title = useTitle();

const albumData = ref(null);

const albumId = computed(() => route.params.albumId);

function updateAlbum(data) {
  albumData.value = data;
}

async function fetchAlbum() {
  updateAlbum(null);
  if (!albumId.value) return;

  const [data, albumArtists, albumContent] = await Promise.all([
    getAlbum(albumId.value),
    getAlbumArtists(albumId.value),
  ]);

  data.album.artists = albumArtists;
  data.content = albumContent;

  updateAlbum(data);

  title.value = albumData.value ? albumData.value.album.name : null;
}

const { loading, run } = createAsyncProcess(fetchAlbum);

watch(albumId, run, { immediate: true });
</script>
