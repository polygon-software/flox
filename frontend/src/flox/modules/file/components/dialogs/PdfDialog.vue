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
import { Ref, ref } from 'vue';

import FileEntity from 'src/flox/modules/file/entities/file.entity';

const props = defineProps<{
  pdf: FileEntity;
}>();

// eslint-disable-next-line vue/define-emits-declaration
defineEmits([...useDialogPluginComponent.emits]);

const visible: Ref<boolean> = ref(true);

const { dialogRef, onDialogHide } = useDialogPluginComponent();
</script>
