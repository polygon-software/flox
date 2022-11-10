<template>
  <div class="img-container">
    <img v-if="image" ref="imgRef" :src="image.file.url" alt="image" />
    <template v-if="image">
      <div
        v-for="label in image.labels"
        :key="label.name + label.confidence"
        class="bbox"
        :class="{ focus: focusLabel && focusLabel.uuid === label.uuid }"
        :style="{
          top: `${label.boundingBox.top * 100}%`,
          left: `${label.boundingBox.left * 100}%`,
          width: `${label.boundingBox.width * 100}%`,
          height: `${label.boundingBox.height * 100}%`,
        }"
      >
        <span>{{ label.name }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps, Ref, ref } from 'vue';

import { ImageEntity } from 'src/flox/modules/image/entities/image.entity';
import { LabelEntity } from 'src/flox/modules/image/entities/label.entity';

const props = defineProps<{
  image: ImageEntity;
  focusLabel?: LabelEntity;
  maxWidth: number;
  maxHeight: number;
}>();

const imgRef: Ref<HTMLImageElement | null> = ref(null);
</script>

<style scoped lang="scss">
.img-container {
  max-width: 99.99%;
  height: 100%;
  position: relative;
  overflow: hidden;

  img {
    z-index: 1;
    max-width: 100%;
    display: block;
    image-orientation: from-image;
  }
}
.bbox {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.69);
  box-shadow: 0 0 1px $primary, 0 0 2px $primary, 0 0 2px $primary,
    0 0 2px $primary, inset 0 0 2px $primary, inset 0 0 2px $primary,
    inset 0 0 2px $primary, inset 0 0 2px $primary;
  border-radius: 5px;

  span {
    position: absolute;
    left: -2px;
    top: -2px;
    color: black;
    background-color: rgba(255, 255, 255, 0.69);
    border-radius: 5px 2px 2px 2px;
    font-size: 0.8rem;
    line-height: 0.8rem;
    padding: 3px;
  }

}
.bbox:hover,
.bbox.focus {
  border: 2px solid $primary;
}
.bbox
.bbox:hover span,
.bbox.focus span {
  color: white;
  background-color: $primary;
}
</style>
