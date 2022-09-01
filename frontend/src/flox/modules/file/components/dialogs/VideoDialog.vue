<template>
  <q-dialog ref="dialogRef" auto-close maximized @hide="onDialogHide">
    <q-media-player
      type="video"
      color="primary"
      dense
      bottom-controls
      big-play-button-color="primary"
      radius="1rem"
      :autoplay="autoplay"
      show-big-play-button
      :sources="sources"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { computed, ComputedRef } from 'vue';

import FileEntity from 'src/flox/modules/file/entities/file.entity';

const props = withDefaults(
  defineProps<{
    video: FileEntity;
    autoplay?: boolean;
  }>(),
  {
    autoplay: false,
  }
);

// eslint-disable-next-line vue/define-emits-declaration
defineEmits([...useDialogPluginComponent.emits]);

const sources: ComputedRef<{ src: string; type: string }[]> = computed(() => {
  if (props.video.url && props.video.mimetype) {
    return [
      {
        src: props.video.url,
        type: props.video.mimetype,
      },
    ];
  }
  throw new Error('Unable to play video without url or mimetype');
});

const { dialogRef, onDialogHide } = useDialogPluginComponent();
</script>
