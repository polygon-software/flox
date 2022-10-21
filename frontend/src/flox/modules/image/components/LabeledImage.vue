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
    >
    <template
      v-if="image"
    >
      <div
        v-for="label in image.labels"
        :key="label.name + label.confidence"
        class="bbox"
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
import {defineProps, ref, watch} from 'vue';
import {ImageEntity} from 'src/flox/modules/image/entities/image.entity';
import {Ref} from '@vue/reactivity';
import {dom} from 'quasar'
import {getImage} from 'src/flox/modules/image/services/image.service';

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
  maxWidth: {
    type: Number,
    required: true,
  },
  maxHeight: {
    type: Number,
    required: true,
  }
})

const image: Ref<ImageEntity|null> = ref(null);

const imgRef: Ref<HTMLImageElement|null> = ref(null);
const width: Ref<number> = ref(0);
const height: Ref<number> = ref(0);

/**
 * Updates image width and height
 * @returns {void}
 */
function updateImageProperties() {
  if (imgRef.value) {
    width.value = dom.width(imgRef.value);
    height.value = dom.height(imgRef.value);
  }
}

watch(() => props.uuid, async () => {
  image.value = await getImage(props.uuid);
})
</script>

<style scoped>
.img-container {
  position: relative;
}
.bbox {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.69);
  box-shadow:
   0 0 1px #687078,
   0 0 2px #687078,
   0 0 2px #687078,
   0 0 2px #687078,
   inset 0 0 2px #687078,
   inset 0 0 2px #687078,
   inset 0 0 2px #687078,
   inset 0 0 2px #687078;
  border-radius: 5px;
}
.bbox:hover {
  border: 2px solid #687078;
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
.bbox:hover span {
  color: white;
  background-color: #687078;
}
</style>
