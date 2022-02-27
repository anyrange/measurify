<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-100 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="show" class="absolute inset-0 bg-black bg-opacity-40 z-50">
        <div
          class="fixed inset-0 flex items-center justify-center"
          @click="close"
        >
          <transition
            enter-active-class="transition ease-out duration-200 transform"
            enter-from-class="opacity-0 translate-y-10 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="ease-in duration-100"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-50 translate-y-10 scale-50"
          >
            <div
              v-show="show"
              class="
                relative
                bg-gray-900-spotify
                rounded
                text-left
                overflow-hidden
                text-white
                shadow-xl
                transform
                transition-all
                align-middle
                sm:max-w-lg
                w-full
                p-2
              "
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
              @click.stop
            >
              <icon
                class="
                  w-8
                  h-8
                  p-1
                  text-gray-500-spotify
                  hover:bg-gray-800-spotify
                  rounded-full
                  duration-100
                  cursor-pointer
                  absolute
                  right-2
                  top-2
                "
                icon="ic:round-close"
                @click="close"
              />
              <slot />
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

const handleKeydown = (e) => {
  if (props.show && e.key === "Escape") {
    close();
  }
};

onMounted(() => document.addEventListener("keydown", handleKeydown));

onBeforeUnmount(() => document.removeEventListener("keydown", handleKeydown));
</script>
