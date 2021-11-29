<template>
  <q-dialog
    ref="dialog"
    title="Application"
  >
    <q-card class="q-pa-md q-ma-md">
      <q-card-section>
        <h5>{{ $t('dashboards.sure_to_reject') }}</h5>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('dashboards.yes_reject')"
          color="negative"
          @click="onYesReject"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('buttons.cancel')"
          color="primary"
          @click="onCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref, Ref, defineEmits, PropType} from 'vue'
import {QDialog} from 'quasar';
import {sendEmail} from 'src/helpers/email-helpers';
import {Company} from 'src/data/types/Company';

const emit = defineEmits(['ok'])

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  companyData: {
    type: Object as PropType<Company>,
    required: true
  },
})

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function show(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}

function hide(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

async function onYesReject(): Promise<void> {
  //TODO: implement in backend to really reject it
  await sendEmail(props.companyData.phone)
  emit('ok')
  hide()
}

function onCancel(): void {
  hide()
}
</script>

<style scoped>

</style>
