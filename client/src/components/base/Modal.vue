<template>
  <teleport to="body">
    <transition
      enter-active-class="transform transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transform transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="show" class="absolute inset-0 z-50 bg-black/40">
        <div
          class="fixed inset-0 flex items-center justify-center"
          @click="close"
        >
          <transition
            enter-active-class="transform transition duration-200 ease-out"
            enter-from-class="translate-y-10 scale-95 opacity-0"
            enter-to-class="translate-y-0 scale-100 opacity-100"
            leave-active-class="duration-100 ease-in"
            leave-from-class="translate-y-0 scale-100 opacity-100"
            leave-to-class="translate-y-10 scale-50 opacity-50"
          >
            <div
              v-show="show"
              class="
                relative
                bg-secondary-darkest
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
                  text-secondary-lighter
                  hover:bg-secondary-darker
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
