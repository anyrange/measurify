<template>
  <div class="masonry w-full">
    <slot></slot>
  </div>
</template>

<style>
.masonry {
  column-count: 2;
  column-gap: 0.5rem;
}

@screen sm {
  .masonry {
    column-count: 3;
  }
}
@screen xl {
  .masonry {
    column-count: 5;
  }
}
@screen 2xl {
  .masonry {
    column-count: 6;
  }
}
</style>
