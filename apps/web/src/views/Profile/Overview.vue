<template>
  <container>
    <container-item>
      <cards>
        <card :title="profile.overview.plays">tracks played</card>
        <card :title="profile.overview.playtime">minutes listened</card>
        <card :title="getMeanTime(profile.overview.meantime)">
          average track duration
        </card>
        <card :title="formatDate(profile.user.registrationDate)">joined</card>
        <card :title="profile.user.country">country</card>
      </cards>
    </container-item>
    <container-item v-if="notEmpty(profile.genres)">
      <container-item-label>
        <base-link :to="{ name: 'profile-reports' }" class="link">
          Genres
        </base-link>
      </container-item-label>
      <horizontal-scroll>
        <badge v-for="genre in profile.genres" :key="genre">{{ genre }}</badge>
      </horizontal-scroll>
    </container-item>
    <container-item v-if="notEmpty(profile.history)">
      <container-item-label>
        <base-link :to="{ name: 'profile-history' }" class="link">
          Recent Tracks
        </base-link>
      </container-item-label>
      <track-rows>
        <template v-if="!loading">
          <template v-if="currentTrack">
            <track-row :track="currentTrack" current date>
              <template #date>
                <figure
                  class="flex flex-row items-center justify-end gap-1"
                  title="now"
                >
                  <base-img :src="now_playing" alt="Listening Now" />
                  <figcaption class="hidden sm:block">Listening</figcaption>
                </figure>
              </template>
            </track-row>
          </template>
          <track-row
            v-for="(item, index) in profile.history.slice(
              0,
              currentTrack ? 4 : 5
            )"
            :key="index + item.id"
            :track="item"
            date
          />
        </template>
        <template v-else>
          <track-row-skeleton v-for="i in 5" :key="i" />
        </template>
      </track-rows>
    </container-item>
    <container-item v-if="notEmpty(profile.top.artists)">
      <container-item-label>
        <base-link :to="{ name: 'profile-history' }" class="link">
          Favourite Artists
        </base-link>
      </container-item-label>
      <horizontal-scroll>
        <spotify-card
          v-for="item in profile.top.artists"
          :key="item.id"
          :item="item"
          type="artist"
        />
      </horizontal-scroll>
    </container-item>
    <container-item v-if="notEmpty(profile.top.albums)">
      <container-item-label>
        <base-link :to="{ name: 'profile-history' }" class="link">
          Favourite Albums
        </base-link>
      </container-item-label>
      <horizontal-scroll>
        <spotify-card
          v-for="item in profile.top.albums"
          :key="item.id"
          :item="item"
          type="album"
        />
      </horizontal-scroll>
    </container-item>
    <container-item v-if="notEmpty(profile.top.tracks)">
      <container-item-label>
        <base-link :to="{ name: 'profile-history' }" class="link">
          Favourite Tracks
        </base-link>
      </container-item-label>
      <track-rows>
        <track-row
          v-for="(item, index) in profile.top.tracks"
          :key="index"
          :track="item"
          :place="index + 1"
          plays
        />
      </track-rows>
    </container-item>
  </container>
</template>

<script setup>
import { computed, ref } from "vue"
import { useTitle } from "@vueuse/core"
import { useProfileStore } from "@/stores/profile"
import { createAsyncProcess } from "@/composable/useAsync"
import { getProfileCurrentTrack } from "@/api"
import { formatDate, notEmpty, getDuration } from "@/utils"
import now_playing from "@/assets/media/now_playing.gif"

const profileStore = useProfileStore()
const profile = computed(() => profileStore.profile)

useTitle(`${profile.value.user.display_name} (@${profile.value.user.username})`)

const currentTrack = ref(null)

const getMeanTime = (meantime) => {
  return getDuration(meantime * 60 * 1000)
}

const fetchCurrentTrack = async () => {
  if (profile.value.inactive) return
  currentTrack.value = await getProfileCurrentTrack({
    username: profile.value.user.username,
  })
}

const { loading, run: loadTrack } = createAsyncProcess(fetchCurrentTrack)

loadTrack()
</script>
