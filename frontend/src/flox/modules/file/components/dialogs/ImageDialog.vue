<template>
  <q-dialog ref="dialogRef" auto-close maximized @hide="onDialogHide">
    <q-img :src="props.image.url" fit="scale-down" style="overflow: hidden" />
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { defineProps } from 'vue';

import { FileEntity } from 'src/flox/modules/file/entities/file.entity';

const props = withDefaults(
  defineProps<{
    image: FileEntity;
    fullscreen?: boolean;
  }>(),
  {
    fullscreen: false,
  }
);

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide } = useDialogPluginComponent();
</script>
