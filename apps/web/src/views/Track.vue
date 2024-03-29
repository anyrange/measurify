<template>
  <async-wrapper :error="error" :loading="loading">
    <template #loading>
      <infopage-skeleton />
    </template>
    <app-bar scroll-target="infopage-title">
      <template #title>
        {{ trackData.track.name }}
      </template>
      <template #right>
        <spotify-link :id="trackData.track.id" type="track" />
      </template>
    </app-bar>
    <infopage-header :item="trackData.track" type="track" />
    <container>
      <cards>
        <card v-if="trackData.isLiked" title="❤">liked</card>
        <card :title="getDuration(trackData.duration_ms)">track length</card>
        <card :title="formatDate(trackData.release_date)">release date</card>
        <card
          v-if="trackData.overview?.playtime"
          :title="trackData.overview.playtime"
        >
          minutes listened
        </card>
        <card
          v-if="trackData.overview?.plays"
          :title="trackData.overview.plays"
        >
          times played
        </card>
        <card
          v-for="(rate, index) in filteredTrackRates"
          :key="index"
          :title="'#' + rate[1]"
        >
          of your most streamed tracks {{ PERIODS[rate[0]] }}
        </card>
      </cards>
      <container-item>
        <container-item-label>Audio features</container-item-label>
        <audio-features :audio-features="trackData.audioFeatures" />
      </container-item>
      <container-item>
        <container-item-label>Album</container-item-label>
        <horizontal-scroll>
          <spotify-card :item="trackData.track.album" type="album" />
        </horizontal-scroll>
      </container-item>
      <container-item>
        <container-item-label>Artists</container-item-label>
        <horizontal-scroll>
          <spotify-card
            v-for="item in trackData.track.artists"
            :key="item.id"
            :item="item"
            type="artist"
          />
        </horizontal-scroll>
      </container-item>
      <container-item>
        <container-item-label>Lyrics</container-item-label>
        <div v-if="lyricsError">
          {{ lyricsError }}
        </div>
        <template v-else>
          <template v-if="lyrics">
            <div
              class="w-full rounded bg-secondary-darker p-2 text-sm text-white shadow-md duration-75 sm:w-auto"
            >
              <pre
                class="whitespace-pre-wrap font-sans text-base"
                v-html="lyrics || 'Lyrics not found'"
              />
            </div>
          </template>
          <template v-else>
            <div>
              <base-button color="gray" @click="loadLyrics">
                <template v-if="loadingLyrics"> Loading... </template>
                <template v-else> Load lyrics </template>
              </base-button>
            </div>
          </template>
        </template>
      </container-item>
      <container-item>
        <container-item-label>
          More tracks by
          <base-link
            class="link"
            :to="{
              name: 'artist',
              params: {
                artistId: trackData.track.artists[0].id,
              },
            }"
          >
            {{ trackData.track.artists[0].name }}
          </base-link>
        </container-item-label>
        <suspense>
          <track-recommendations :track-id="trackData.track.id" />
          <template #fallback>
            <track-rows>
              <track-row-skeleton v-for="i in 10" :key="i" />
            </track-rows>
          </template>
        </suspense>
      </container-item>
    </container>
  </async-wrapper>
</template>

<script setup>
import { computed, watch, ref } from "vue"
import { useRoute } from "vue-router"
import { useTitle } from "@vueuse/core"
import { createAsyncProcess } from "@/composable/useAsync"
import { getTrack, getTrackLyrics } from "@/api"
import { formatDate, getDuration } from "@/utils"
import { PERIODS } from "@/config"

const route = useRoute()
const title = useTitle()

const trackId = computed(() => route.params.trackId)

const trackData = ref(null)
const lyrics = ref("")

const filteredTrackRates = computed(() => {
  if (!trackData.value.rates) return []
  return Object.entries(trackData.value.rates).filter((item) => item[1])
})

function updateTrack(data) {
  trackData.value = data
}

async function fetchTrack() {
  if (!trackId.value) return
  updateTrack(null)
  lyrics.value = ""
  const track = await getTrack(trackId.value)
  updateTrack(track)
  title.value = trackData.value ? trackData.value.track.name : null
}

async function getLyrics() {
  const { lyrics: lyricsData } = await getTrackLyrics({
    title: trackData.value.track.name,
    artist: trackData.value.track.artists[0].name,
  })
  lyrics.value = lyricsData
}

const { loading, run, error } = createAsyncProcess(fetchTrack)
const {
  loading: loadingLyrics,
  run: loadLyrics,
  lyricsError,
} = createAsyncProcess(getLyrics)

watch(trackId, run, { immediate: true })
</script>
