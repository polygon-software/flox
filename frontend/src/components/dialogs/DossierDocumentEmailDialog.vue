<template>
  <q-dialog
    ref="dialogRef"
    :title="$t('dossier.send_document')"
  >
    <q-card style="width: 600px;">
      <q-card-section>
        <h5 class="q-pa-none q-ma-none">
          {{ $t('buttons.send_by_email') }}
        </h5>
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="targetAddresses"
          class="q-ma-md"
          outlined
          multiple
          use-chips
          use-input
          new-value-mode="add"
          stack-label
          dense
          hide-dropdown-icon
          :label="$t('dossier.recipients')"
        />

        <q-item-label caption>
          {{ $t('dossier.send_email_description') }}
        </q-item-label>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          icon="mail_outline"
          :label="$t('buttons.submit')"
          color="primary"
          @click="onOk"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('buttons.cancel')"
          color="primary"
          flat
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {defineEmits, ref} from 'vue'
import {QVueGlobals, useQuasar} from 'quasar';
import {showNotification} from 'src/helpers/notification-helpers';
import {i18n} from 'boot/i18n';
import _ from 'lodash';
import {executeMutation} from 'src/helpers/data-helpers';
import {SEND_DOSSIER_DOCUMENT_EMAIL} from 'src/data/mutations/DOSSIER';
import {MutationObject} from 'src/data/DATA-DEFINITIONS';
import { useDialogPluginComponent } from 'quasar'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(useDialogPluginComponent.emits)

// REQUIRED; must be called inside of setup()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const $q: QVueGlobals = useQuasar()

const props = defineProps({
  // Default addresses
  addresses: {
    type: Array,
    required: true
  },
  // Dossier UUID
  uuid: {
    type: String,
    required: true
  },
  // File to attach to the E-mail's UUID
  fileUuid: {
    type: String,
    required: true
  }
})


// Addresses to send to (defaults to those given to dossier as prop)
const targetAddresses = ref(_.cloneDeep(props.addresses))

/**
 * On OK, send e-mail to all entered addresses
 * @returns {Promise<void>} - done
 */
async function onOk() {
  // Send E-mail mutation
  await executeMutation(
    SEND_DOSSIER_DOCUMENT_EMAIL as MutationObject,
    {
      uuid: props.uuid,
      recipients: targetAddresses.value,
      fileUuid: props.fileUuid
    })

  // Show confirmation prompt
  showNotification(
    $q,
    i18n.global.t('messages.email_sent'),
    undefined,
    'positive'
  )

  onDialogOK()
}

</script>
