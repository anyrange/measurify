<template>
  <li
    v-if="visible"
    v-wave
    class="px-5 py-3 text-white text-sm rounded leading-4 font-medium cursor-pointer select-none horizontal-scroll-card"
    :class="{
      'bg-secondary-dark': isActive,
      'opacity-40 cursor-not-allowed': disabled,
    }"
    @click="activateTab(name)"
  >
    <slot />
  </li>
</template>

<script setup>
import { inject, computed } from "vue"

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  loading: {
    type: Boolean,
    required: false,
  },
})

const emit = defineEmits(["selected"])

const state = inject("state")
const selectTab = inject("selectTab")

const active = computed(() => state.active())
const isDisabled = computed(() => props.disabled || props.loading)
const isActive = computed(() => props.name === active.value)

const activateTab = (name) => {
  if (isDisabled.value) {
    return
  }
  selectTab(name)
  emit("selected", name)
}
</script>
