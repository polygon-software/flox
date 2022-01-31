<template>
  <q-dialog
    ref="dialog"
    :title="$t('bank.new_user')"
  >
    <q-card class="q-pa-md q-ma-md">
      <q-card-section>
        <p>{{$t('account_data.email')}}: {{props.email}}</p>
        <p>{{$t('account_data.password')}}: {{props.password}}</p>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('general.return')"
          color="positive"
          @click="onYesReject"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref, Ref, defineEmits} from 'vue'
import {QDialog} from 'quasar';

const emit = defineEmits(['ok'])

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
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

/**
 * Reject an application
 * @returns {void}
 */
function onYesReject(): void {
  emit('ok')
  hide()
}
</script>

