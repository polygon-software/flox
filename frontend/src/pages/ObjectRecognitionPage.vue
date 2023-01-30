<template>
  <div>
    <div class="row justify-between items-center">
      <h4>{{ $t('object_recognition.object_recognition') }}</h4>
      <div class="row">
        <LazySearchField
          v-if="importImageMode"
          v-model="filesToImport"
          class="q-mr-md file-search-field"
          :class="{ active: importImageMode }"
          :query="SEARCH_FILES"
          :options-label="fullPathFormat"
          :select-props="{
            outlined: true,
            autofocus: true,
            dense: true,
            color: 'primary',
            label: $t('object_recognition.search_files'),
          }"
        />
        <q-btn
          unelevated
          color="primary"
          :label="importImageMode ? '' : $t('object_recognition.import_images')"
          class="q-mr-sm file-search-btn"
          :class="{ active: importImageMode }"
          :icon-right="importImageMode ? 'check' : 'file_copy'"
          no-caps
          :disable="importImageMode && filesToImport.length === 0"
          @click="onImportButtonClick"
        />
      </div>
    </div>
    <p>
      {{ $t('object_recognition.description') }}
    </p>
    <div>
      <div class="row justify-center q-mt-lg">
        <div class="col-12 col-md-6 q-px-sm" style="height: fit-content">
          <LabeledImage
            :image="focusImage"
            :focus-label="focusLabel"
            class="rounded-borders"
            @focus="focusOn($event)"
          />
        </div>
        <div class="col-12 col-md-6 q-px-sm">
          <div v-if="focusImage" class="q-px-sm">
            <h5 class="q-my-none">{{ focusImage.file?.filename }}</h5>
            <p class="text-grey">Path: {{ focusImage.file?.path }}</p>
          </div>
          <q-list
            v-if="focusImage"
            bordered
            separator
            style="min-width: 250px; height: 400px; overflow-y: scroll"
            class="rounded-borders full-width"
          >
            <q-item
              v-for="label in sortedFocusLabels"
              :key="label.uuid"
              v-ripple
              clickable
              :active="label === focusLabel"
              active-class="bg-accent"
              @click="focusOn(label)"
            >
              <q-item-section class="full-width">
                <q-item-label class="text-weight-bold">
                  {{ label?.name }}
                </q-item-label>
                <q-item-label caption>
                  {{ label?.parents?.join(', ') }}
                  <q-linear-progress
                    :value="(label?.confidence ?? 0) / 100"
                    class="q-mt-md"
                  />
                </q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>
                  {{ Math.round(label?.confidence ?? 0.0) }}%
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
      <template v-for="image in images" :key="image.uuid">
        <q-img
          v-if="image.file?.url"
          :ratio="1.2"
          width="150px"
          :src="image.file?.url"
          class="image q-ma-sm cursor-pointer"
          :class="{ active: focusImage && focusImage.uuid === image.uuid }"
          @click="
            focusImage && focusImage.uuid === image.uuid
              ? (focusImage = null)
              : (focusImage = image)
          "
        />
      </template>
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
import { dom, useQuasar } from 'quasar';

import ImageEntity from 'src/flox/modules/image/entities/image.entity';
import {
  createImage,
  getAllMyImages,
  getImageForFile,
} from 'src/flox/modules/image/services/image.service';
import LabeledImage from 'src/flox/modules/image/components/LabeledImage.vue';
import LabelEntity from 'src/flox/modules/image/entities/label.entity';
import LazySearchField from 'src/flox/modules/form/components/LazySearchField.vue';
import { SEARCH_FILES } from 'src/flox/modules/file/file.query';
import FileEntity from 'src/flox/modules/file/entities/file.entity';
import {
  showErrorNotification,
  showNotification,
  showSuccessNotification,
} from 'src/tools/notification.tool';
import { i18n } from 'boot/i18n';

const $q = useQuasar();

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
  images.value = await getAllMyImages(take.value, skip.value, 60 * 60);
  if (images.value.length === 0 && skip.value > 0) {
    skip.value -= take.value;
  }
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

/**
 * Function that handles import of files as images
 */
async function onImportButtonClick(): Promise<void> {
  if (!importImageMode.value) {
    importImageMode.value = true;
  } else {
    const newImagesPromises = filesToImport.value.map(async (file) => {
      try {
        const importedImage = await getImageForFile(file.uuid, 360);
        showNotification(
          $q,
          i18n.global.t('object_recognition.image_already_imported'),
          {}
        );
        return importedImage;
      } catch (importError) {
        try {
          const createdImage = await createImage(file.uuid, true);
          showSuccessNotification(
            $q,
            i18n.global.t('object_recognition.image_imported')
          );
          return createdImage;
        } catch (createError) {
          showErrorNotification(
            $q,
            i18n.global.t('object_recognition.not_image')
          );
        }
      }
      return undefined;
    });
    filesToImport.value = [];
    importImageMode.value = false;
    await Promise.allSettled(newImagesPromises);
    await loadImages();
  }
}

/**
 * Shifts a new label into focus
 *
 * @param label - label to focus on
 */
function focusOn(label: LabelEntity): void {
  if (focusLabel.value && focusLabel.value === label) {
    focusLabel.value = null;
  } else {
    focusLabel.value = label;
  }
}

/**
 * Concatenate file path and name
 *
 * @param file - input file
 * @returns concatenation of path and name
 */
function fullPathFormat(file: FileEntity): string {
  if (!file.path || file.path === '/') {
    return file.filename ?? '';
  }
  if (!file.filename) {
    return file.path;
  }
  return `${file.path}/${file.filename}`;
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
.file-search-field {
  width: 0;
}
.file-search-field.active {
  width: 300px;
}
.file-search-btn {
  width: 350px;
}
.file-search-btn.active {
  width: 50px;
}
</style>
