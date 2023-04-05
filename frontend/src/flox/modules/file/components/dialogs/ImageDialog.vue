<template>
  <q-dialog ref="dialogRef" auto-close maximized @hide="onDialogHide">
    <q-img :src="image.url" fit="scale-down" style="overflow: hidden" />
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';

import FileEntity from 'src/flox/modules/file/entities/file.entity';

const props = defineProps<{
  image: FileEntity;
}>();

// eslint-disable-next-line vue/define-emits-declaration
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide } = useDialogPluginComponent();
</script>
