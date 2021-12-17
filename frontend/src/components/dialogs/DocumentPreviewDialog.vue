<template>
  <q-dialog
    ref="dialog"
    title="Preview"
  >
    <q-card
      class="flex content-center items-center bg-transparent"
      flat
      style="width: 1000px; max-width: 1500px; height: 1000px; max-height: 1500px;"
    >
      <q-card-section>
        <object
          :data="props.url + '#page=1&zoom=80'"
          type="application/pdf"
          width="950"
          height="950"
        >
          <embed :src="props.url" type="application/pdf" />
        </object>

      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref, Ref} from 'vue';
import {QDialog} from 'quasar';

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  url: {
    required: true,
    type: String,
    default: '',
  },
})

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}

// eslint-disable-next-line require-jsdoc
function hide(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}
</script>
