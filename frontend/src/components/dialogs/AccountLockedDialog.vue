<template>
  <q-dialog
    ref="dialog"
    :persistent="true"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 300px">
      <q-card-section class="flex flex-center column">
        <h5 class="q-ma-sm">
          {{ $t('errors.account_locked') }}
        </h5>
        <q-icon
          name="block"
          color="negative"
          size="150px"
          class="q-ma-md"
        />
        <p class="text-grey-8">
          {{
            untilDate ?
          $t('errors.account_locked_until', { date: formatDateTime(untilDate) })
          :
          $t('errors.account_locked_permanently')
          }}
        </p>
      </q-card-section>
      <q-separator dark/>
      <q-card-actions align="right">
        <q-btn
          :label="$t('buttons.ok')"
          color="primary"
          @click="hide"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref, Ref} from 'vue';
import {QDialog} from 'quasar'
import {formatDateTime} from 'src/helpers/format-helpers';

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  untilDate: {
    type: Date,
    required: false,
    default: null,
  },
})
</script>
