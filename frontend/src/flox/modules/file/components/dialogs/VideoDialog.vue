<template>
  <q-dialog ref="dialogRef" auto-close maximized @hide="onDialogHide">
    <q-media-player
      type="video"
      color="primary"
      dense
      bottom-controls
      big-play-button-color="primary"
      radius="1rem"
      :autoplay="props.autoplay"
      :show-big-play-button="true"
      :sources="sources"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { computed, ComputedRef, defineProps } from 'vue';

import { FileEntity } from 'src/flox/modules/file/entities/file.entity';

const props = withDefaults(
  defineProps<{
    video: FileEntity;
    autoplay?: boolean;
    fullscreen?: boolean;
  }>(),
  {
    autoplay: false,
    fullscreen: false,
  }
);

const sources: ComputedRef<{ src: string; type: string }[]> = computed(() => [
  {
    src: props.video.url,
    type: props.video.mimetype,
  },
]);

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>
