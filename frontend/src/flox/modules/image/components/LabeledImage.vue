<template>
  <div class="img-container">
    <img
      v-if="image"
      ref="imgRef"
      :src="image.file?.url"
      alt="image"
      class="full-width"
    />
    <template v-if="image">
      <div
        v-for="label in image.labels"
        :key="`${label?.name} ${label?.confidence}`"
        class="bbox cursor-pointer"
        :class="{
          focus: focusLabel && focusLabel.uuid === label.uuid,
          defocus: focusLabel && focusLabel.uuid !== label.uuid,
        }"
        :style="{
          top: `${(label.boundingBox?.top ?? 0) * 100}%`,
          left: `${(label.boundingBox?.left ?? 0) * 100}%`,
          width: `${(label.boundingBox?.width ?? 0) * 100}%`,
          height: `${(label.boundingBox?.height ?? 0) * 100}%`,
        }"
        @click="emit('focus', label)"
      >
        <span>{{ label.name }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

import ImageEntity from 'src/flox/modules/image/entities/image.entity';
import LabelEntity from 'src/flox/modules/image/entities/label.entity';

const props = defineProps<{
  image?: ImageEntity | null;
  focusLabel?: LabelEntity | null;
}>();

const emit = defineEmits<{
  (e: 'focus', label: LabelEntity): void;
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
    opacity: 1;
  }
}
.bbox:hover,
.bbox.focus {
  border: 2px solid $primary;
  background-color: rgba($primary, 0.35);
}
.bbox.defocus {
  opacity: 0.3;
}
.bbox .bbox:hover span,
.bbox.focus span {
  opacity: 0;
  color: white;
  background-color: $primary;
}
</style>
