<template>
  <container-item v-if="relatedArtists.length">
    <container-item-label>Related Artists</container-item-label>
    <horizontal-scroll>
      <spotify-card
        v-for="item in relatedArtists"
        :key="item.id"
        :item="item"
        type="artist"
      />
    </horizontal-scroll>
  </container-item>
</template>

<script setup>
import { ref } from "vue"
import { getRelatedArtists } from "@/api"

const props = defineProps({
  artistId: {
    type: String,
    required: true,
  },
})

const relatedArtists = ref([])

relatedArtists.value = await getRelatedArtists(props.artistId)
</script>
