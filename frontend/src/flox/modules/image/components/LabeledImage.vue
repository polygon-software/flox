<template>
  <div
    class="img-container"
    :style="{
      width: `${maxWidth}px`,
      height: `${maxHeight}px`,
    }"
  >
    <img
      v-if="image"
      ref="imgRef"
      :src="image.file.url"
      alt="image"
      style="max-width: 100%; max-height: 100%"
      @load="updateImageProperties"
    />
    <template v-if="image">
      <div
        v-for="label in image.labels"
        :key="label.name + label.confidence"
        class="bbox"
        :class="{ focus: focusLabel && focusLabel.uuid === label.uuid }"
        :style="{
          top: `${label.boundingBox.top * height}px`,
          left: `${label.boundingBox.left * width}px`,
          width: `${label.boundingBox.width * width}px`,
          height: `${label.boundingBox.height * height}px`,
        }"
      >
        <span>{{ label.name }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { dom } from 'quasar';
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
const width: Ref<number> = ref(0);
const height: Ref<number> = ref(0);

/**
 * Updates image width and height
 */
function updateImageProperties(): void {
  if (imgRef.value) {
    width.value = dom.width(imgRef.value);
    height.value = dom.height(imgRef.value);
  }
}
</script>

<style scoped lang="scss">
.img-container {
  position: relative;
}
.bbox {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.69);
  box-shadow: 0 0 1px $primary, 0 0 2px $primary, 0 0 2px $primary, 0 0 2px $primary,
    inset 0 0 2px $primary, inset 0 0 2px $primary, inset 0 0 2px $primary,
    inset 0 0 2px $primary;
  border-radius: 5px;
}
.bbox:hover,
.bbox.focus {
  border: 2px solid $primary;
}
.bbox span {
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
.bbox:hover span,
.bbox.focus span {
  color: white;
  background-color: $primary;
}
</style>
