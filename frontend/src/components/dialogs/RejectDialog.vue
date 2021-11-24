<template>
  <q-dialog
    ref="dialog"
    title="Application"
  >
    <q-card>
      <q-card-section>
        <h2>{{ $t('sure_to_reject') }}</h2>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('yes_reject')"
          color="negative"
          @click="onYesReject"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('cancel')"
          color="negative"
          @click="onCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref, Ref, defineEmits} from 'vue'
import {QDialog} from 'quasar';

const emit = defineEmits(['Hidepopups'])

const dialog: Ref<QDialog> = ref<QDialog>(null)

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function show(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value.show();
}

function hide(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value.hide()
}

function onYesReject(): Promise<void> {
  //TODO: implement in backend to really reject it
  emit('Hidepopups')
  hide()
}

function onCancel(): void {
  //TODO: Send cancel message
  console.log('cancel')
  emit('Hidepopups')
  hide()
}
</script>

<style scoped>

</style>
