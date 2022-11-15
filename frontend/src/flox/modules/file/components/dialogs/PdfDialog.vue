<template>
  <q-dialog ref="dialogRef" auto-close @hide="onDialogHide">
    <q-card
      class="relative-position"
      style="min-width: 80vw; width: 80vw; min-height: 90vh; height: 90vh"
    >
      <q-pdfviewer v-model="visible" :src="pdf.url" type="html5" />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { defineProps, Ref, ref } from 'vue';

import { FileEntity } from 'src/flox/modules/file/entities/file.entity';

const visible: Ref<boolean> = ref(true);

const props = withDefaults(
  defineProps<{
    pdf: FileEntity;
    fullscreen?: boolean;
  }>(),
  {
    fullscreen: false,
  }
);

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
</script>
