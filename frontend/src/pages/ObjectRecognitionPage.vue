<template>
  <div>
    <div class="row justify-between items-center">
      <h4>{{ $t('object_recognition.object_recognition') }}</h4>
      <q-btn
        v-if="!importImageMode"
        unelevated
        color="primary"
        :label="$t('object_recognition.import_images')"
        class="q-mr-sm"
        icon-right="file_copy"
        no-caps
        style="width: 300px"
        @click="importImageMode = true"
      />
      <OnClickOutside v-else @trigger="importImageMode = false">
        <LazySearchField
          v-model="filesToImport"
          class="q-mr-md"
          :query="SEARCH_FILES"
          options-label="filename"
          style="width: 300px"
          :select-props="{
            outlined: true,
            autofocus: true,
            dense: true,
            class: 'q-mr-sm',
            color: 'primary',
            label: $t('object_recognition.search_files'),
          }"
        />
      </OnClickOutside>
    </div>
    <p>
      Object recognition analyzes any given image and detect over 5000 different
      labels.
    </p>
    <div style="height: calc(100vh - 400px)">
      <div
        v-if="!focusImage"
        class="row justify-center items-center bg-accent rounded-borders"
        style="height: 400px; width: 500px"
      >
        <p>Select an Image</p>
      </div>
      <div class="row justify-center q-mt-lg">
        <div class="col-12 col-md-6 q-px-sm">
          <LabeledImage
            :image="focusImage"
            :focus-label="focusLabel"
            class="rounded-borders"
          />
        </div>
        <div class="col-12 col-md-6 q-px-sm">
          <div v-if="focusImage" class="q-px-sm">
            <h5 class="q-my-none">{{ focusImage.file.filename }}</h5>
            <p class="text-grey">Path: {{ focusImage.file.path }}</p>
          </div>
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
    </div>
    <div style="height: 250px" />
    <div
      ref="thumbContainerRef"
      class="thumbnail-container row items-center justify-center"
    >
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
import { OnClickOutside } from '@vueuse/components';

import { ImageEntity } from 'src/flox/modules/image/entities/image.entity';
import { getAllMyImages } from 'src/flox/modules/image/services/image.service';
import LabeledImage from 'src/flox/modules/image/components/LabeledImage.vue';
import { LabelEntity } from 'src/flox/modules/image/entities/label.entity';
import LazySearchField from 'components/forms/LazySearchField.vue';
import { SEARCH_FILES } from 'src/flox/modules/file/file.query';
import { FileEntity } from 'src/flox/modules/file/entities/file.entity';

const take: Ref<number> = ref(0);
const skip: Ref<number> = ref(0);

const importImageMode: Ref<boolean> = ref(false);
const filesToImport: Ref<FileEntity[]> = ref([]);

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
  images.value = await getAllMyImages(take.value, skip.value, 60 * 60);
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
    take.value = Math.floor((width - 60) / 180);
    await loadImages();
  }
});
</script>

<style scoped lang="scss">
.thumbnail-container {
  position: fixed;
  height: 150px;
  bottom: 0;
  left: 240px;
  right: 0;
  background-color: #f6f6f2;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
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
