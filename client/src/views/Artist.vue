<template>
  <suspense-wrapper :loading="loading" :error="error">
    <container>
      <figure class="responsive-picture">
        <base-img
          parallax
          image-type="artist"
          :src="artistData.artist.image"
          :alt="artistData.artist.name"
          class="responsive-picture__image"
        />
        <figcaption class="responsive-picture__title">
          <spotify-link
            :link="`https://open.spotify.com/artist/${artistData.artist.id}`"
          >
            {{ artistData.artist.name }}
          </spotify-link>
        </figcaption>
      </figure>
      <cards>
        <card v-if="artistData.isLiked" title="❤">following</card>
        <card :title="artistData.followers">followers</card>
        <card
          v-for="(rate, index) in filteredArtistRates"
          :key="index"
          :title="'#' + rate[1]"
        >
          of your most streamed artists {{ PERIODS[rate[0]] }}
        </card>
        <card
          v-for="(rate, index) in filteredTracksRates"
          :key="index"
          :title="rate[1].length"
        >
          times
          <a
            class="text-green-500-spotify font-bold cursor-pointer"
            @click="
              currentItem = rate[0];
              modalOpened = true;
            "
          >
            {{ artistData.artist.name }}
          </a>
          appeared in top 50 tracks
          {{
            rate[0] === "LT" ? PERIODS[rate[0]] : "from the " + PERIODS[rate[0]]
          }}
        </card>
      </cards>
      <container-item>
        <container-item-label>Audio features</container-item-label>
        <audio-features :audio-features="artistData.audioFeatures" />
      </container-item>
      <container-item>
        <container-item-label>Genres</container-item-label>
        <horizontal-scroll>
          <badge v-for="(genre, index) in artistData.genres" :key="index">
            {{ genre }}
          </badge>
        </horizontal-scroll>
      </container-item>
      <container-item>
        <container-item-label>Albums</container-item-label>
        <horizontal-scroll>
          <spotify-card
            v-for="item in artistData.albums"
            :key="item.id"
            :item="item"
            type="album"
          />
        </horizontal-scroll>
      </container-item>
      <container-item v-if="artistData.favouriteTracks.length">
        <container-item-label>Favourite tracks</container-item-label>
        <track-rows>
          <track-row
            v-for="(item, index) in artistData.favouriteTracks"
            :key="index"
            :track="item"
            plays-or-date="plays"
            :place="index + 1"
          />
        </track-rows>
      </container-item>
      <container-item v-if="artistData.relatedArtists.length">
        <container-item-label>Related Artists</container-item-label>
        <horizontal-scroll>
          <spotify-card
            v-for="item in artistData.relatedArtists"
            :key="item.id"
            :item="item"
            type="artist"
          />
        </horizontal-scroll>
      </container-item>
    </container>
    <modal :show="modalOpened" @close="modalOpened = false">
      <div class="flex flex-col gap-3 p-3">
        <div class="flex flex-col gap-1">
          <h3 class="sm:text-2xl text-xl font-semibold">
            Most streamed tracks
          </h3>
          <span class="text-gray-500-spotify">
            The amount of times a track by
            {{ artistData.artist.name }} appears in your top
            <strong>
              {{
                currentItem === "LT"
                  ? PERIODS[currentItem]
                  : "in the " + PERIODS[currentItem]
              }}
            </strong>
          </span>
        </div>
        <hr />
        <div class="flex flex-col gap-y-2">
          <div
            v-for="(track, index) in tracksOfSelectedTerm"
            :key="index"
            class="flex flex-row items-end gap-x-2 text-base"
          >
            <span class="text-gray-500-spotify">#{{ track.place }}</span>
            <router-link
              class="link"
              :to="{ name: 'track', params: { trackId: track.id } }"
            >
              {{ track.name }}
            </router-link>
          </div>
        </div>
      </div>
    </modal>
  </suspense-wrapper>
</template>

<script setup>
import { computed, ref } from "vue";
import { useArtist } from "@/composable/useArtist.js";
import PERIODS from "@/assets/configs/periods.json";

const { loading, error, artistData } = useArtist();

const modalOpened = ref(false);
const currentItem = ref("");

const filteredArtistRates = computed(() =>
  Object.entries(artistData.value.rates.art).filter((item) => item[1])
);

const filteredTracksRates = computed(() =>
  Object.entries(artistData.value.rates.trc).filter((item) => item[1].length)
);

const tracksOfSelectedTerm = computed(
  () => artistData.value.rates.trc[currentItem.value]
);
</script>
