<template>
  <q-dialog
    ref="dialog"
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
          @click="onCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {PropType, ref, Ref} from 'vue'
import { Company } from 'src/data/types/Company'
import {executeMutation} from 'src/helpers/data-helpers';
import {
  ENABLE_COMPANY_DOCUMENT_UPLOAD,
  REJECT_COMPANY,
  UPDATE_COMPANY_EMAIL
} from 'src/data/mutations/COMPANY';
import {QDialog, QVueGlobals, useQuasar} from 'quasar';
import RejectApplicationDialog from 'components/dialogs/RejectApplicationDialog.vue'
import {Address} from 'src/data/types/Address';
import {sendDocumentUploadEmail} from 'src/helpers/email-helpers';
import {showNotification} from 'src/helpers/notification-helpers';
import {i18n} from 'boot/i18n';
import _ from 'lodash';

const $q: QVueGlobals = useQuasar()

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  // Default addresses
  addresses: {
    type: Array,
    required: true
  },
  file: {
    type: Object,
    required: false, // TODO change
    default: null,
  }
})

// Addresses to send to (defaults to those given to dossier as prop)
const targetAddresses = ref(_.cloneDeep(props.addresses))

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
 * On OK, send e-mail to all entered addresses
 * @returns {void} - done
 */
function onOk(): void {

  // TODO validate for valid inputs
  // TODO actual send email mutation
  //await executeMutation(SEND_DOSSIER_FILE_EMAIL, {addresses: .addresses})

  // Show confirmation prompt TODO
  showNotification(
    $q,
    i18n.global.t('messages.email_sent'),
    undefined,
    'positive'
  )

  hide()
}

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}
</script>
