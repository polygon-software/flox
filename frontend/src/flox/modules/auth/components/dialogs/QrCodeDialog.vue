<template>
  <q-dialog
    ref="dialog"
    :persistent="true"
  >
    <q-card class="q-pa-sm text-center" style="width: 400px; min-height: 300px">
      <q-card-section class="flex flex-center column">
        <h5 class="q-ma-sm">
          {{  $t('authentication.set_up_2fa') }}
        </h5>
        <p class="text-grey-8">
          {{ $t('authentication.set_up_2fa_description') }}
        </p>
        <qrcode-vue
          :value="props.value"
          :size="180"
        />
      </q-card-section>
      <q-separator dark/>
      <q-card-actions align="center">
        <q-btn
          :label="$t('general.cancel')"
          color="primary"
          flat
          @click="hide"
        />
        <q-btn
          :label="$t('general.ok')"
          color="primary"
          @click="onOk"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';
import {defineEmits, defineProps, ref, Ref} from 'vue';
import {QDialog} from 'quasar'

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)
const emit = defineEmits(['ok'])
// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}
// eslint-disable-next-line require-jsdoc
function hide(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

/**
 * On Ok, emit ok event
 * @returns {void}
 */
function onOk(): void {
  emit('ok')
  hide()
}
const props = defineProps({
  value: {
    type: String,
    required: true,
    default: '',
  },
})
</script>
