<template>
  <div>
    <h4>{{ $t('object_recognition.object_recognition') }}</h4>
    <div class="row justify-center">
      <div class="col-12 col-md-6">
        <LabeledImage
          :image="focusImage"
          :focus-label="focusLabel"
          :max-width="500"
          :max-height="500"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-list
          v-if="focusImage"
          bordered
          separator
          style="min-width: 250px"
          class="rounded-borders full-width"
        >
          <q-item
            v-for="label in sortedFocusLabels"
            :key="label.uuid"
            v-ripple
            clickable
            :active="label === focusLabel"
            active-class="bg-accent"
            @click="
              focusLabel && focusLabel === label
                ? (focusLabel = null)
                : (focusLabel = label)
            "
          >
            <q-item-section class="full-width">
              <q-item-label class="text-weight-bold">
                {{ label.name }}
              </q-item-label>
              <q-item-label caption>
                <q-linear-progress
                  :value="label.confidence / 100"
                  class="q-mt-md"
                />
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label caption>
                {{ Math.round(label.confidence) }}%
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <div ref="thumbContainerRef" class="row items-center full-width">
      <q-icon
        name="arrow_back_ios"
        size="md"
        color="primary"
        class="cursor-pointer"
        @click="prev"
      />
      <q-img
        v-for="image in images"
        :key="image.uuid"
        :ratio="1.2"
        width="150px"
        :src="image.file.url"
        class="image q-ma-sm cursor-pointer"
        :class="{ active: focusImage && focusImage.uuid === image.uuid }"
        @click="
          focusImage && focusImage.uuid === image.uuid
            ? (focusImage = null)
            : (focusImage = image)
        "
      />
      <q-icon
        name="arrow_forward_ios"
        size="md"
        color="primary"
        class="cursor-pointer"
        @click="next"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, Ref, watch } from 'vue';
import { dom } from 'quasar';

import { ImageEntity } from 'src/flox/modules/image/entities/image.entity';
import { getAllMyImages } from 'src/flox/modules/image/services/image.service';
import LabeledImage from 'src/flox/modules/image/components/LabeledImage.vue';
import { LabelEntity } from 'src/flox/modules/image/entities/label.entity';

const take: Ref<number> = ref(0);
const skip: Ref<number> = ref(0);

const images: Ref<ImageEntity[]> = ref([]);
const focusImage: Ref<ImageEntity | null> = ref(null);
const focusLabel: Ref<LabelEntity | null> = ref(null);
const thumbContainerRef: Ref<HTMLDivElement | null> = ref(null);

const sortedFocusLabels: ComputedRef<LabelEntity[]> = computed(() => {
  if (focusImage.value === null) {
    return [];
  }
  const labels: LabelEntity[] = [...(focusImage.value.labels as LabelEntity[])];
  return labels.sort((l1, l2) => {
    if (!l1.confidence || !l2.confidence) {
      return 0;
    }
    return l1?.confidence > l2?.confidence ? -1 : 1;
  });
});

/**
 * Load page of images
 */
async function loadImages(): Promise<void> {
  console.log('Loadingimages');
  images.value = await getAllMyImages(take.value, skip.value, 360);
}
watch(skip, loadImages);

/**
 * Loads previous bunch of images
 */
function prev(): void {
  skip.value = Math.max(skip.value - take.value, 0);
}

/**
 * Loads next bunch of images
 */
function next(): void {
  skip.value += take.value;
}

onMounted(async () => {
  if (thumbContainerRef.value) {
    const width = dom.width(thumbContainerRef.value);
    take.value = Math.floor(width / 160);
    await loadImages();
  }
});
</script>

<style scoped lang="scss">
.image {
  border-radius: 8px;
  background-color: $primary;
}
.image:deep(img):hover {
  opacity: 0.8;
}
.image:deep(img) {
  border-radius: 6px;
  border: 2px solid #f1f1f1;
  opacity: 1;
}
.active:deep(img) {
  border: 2px solid $primary;
  opacity: 0.8;
}
</style>
