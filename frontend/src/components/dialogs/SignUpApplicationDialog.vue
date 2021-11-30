<template>
  <q-dialog
    ref="dialog"
    :title="$t('dashboards.application')"
  >
    <q-card style="width: 600px;">
      <q-card-section>
        <q-list
          bordered
          separator
        >
          <q-item v-ripple>
            <q-item-section >
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.company_name') }}:</p>
                <p class="col-7">{{ props.company.company_name }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.language') }}:</p>
                <p class="col-7">{{ props.company.language }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.company_uid') }}:</p>
                <p class="col-7">{{ props.company.uid.length > 0 ? props.company.uid : '-' }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.full_name') }}:</p>
                <p class="col-7">{{ props.company.first_name }} {{ props.company.last_name }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.domicile_address') }}:</p>
                <p class="col-7">{{ domicile_address.prettyString() }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.correspondence_address') }}:</p>
                <p class="col-7">{{ correspondence_address.prettyString() }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.phone_number') }}:</p>
                <p class="col-7">{{ props.company.phone }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.email') }}:</p>
                <p class="col-7">{{ props.company.email }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.branch_structure') }}:</p>
                <p class="col-7">{{ props.company.branch_structure ? $t('general.yes') : $t('general.no') }}</p>
              </div>
            </q-item-section>
          </q-item>

        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('dashboards.enable_upload')"
          color="primary"
          @click="onOk"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('dashboards.reject')"
          color="negative"
          @click="onReject"
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
import {ENABLE_COMPANY_DOCUMENT_UPLOAD} from 'src/data/mutations/COMPANY';
import {QDialog, QVueGlobals, useQuasar} from 'quasar';
import RejectDialog from 'src/components/dialogs/RejectDialog.vue'
import {Address} from 'src/data/types/Address';
import {sendEmail} from 'src/helpers/email-helpers';
import ROUTES from 'src/router/routes';

const $q: QVueGlobals = useQuasar()

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  company: {
    type: Object as PropType<Company>,
    required: true
  },
})

// Convert addresses to actual address instances
const domicile_address = new Address(
  props.company.domicile_address.street,
  props.company.domicile_address.number,
  props.company.domicile_address.city,
  props.company.domicile_address.zip_code,
)
const correspondence_address = new Address(
  props.company.correspondence_address.street,
  props.company.correspondence_address.number,
  props.company.correspondence_address.city,
  props.company.correspondence_address.zip_code,
)

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

/**
 * On OK, enable document upload for the company and send e-mail
 */
async function onOk(): Promise<void> {
  // Verify all required attributes present
  const company = props.company
  if([company, company.uuid, company.email].some((value) => value === undefined || value === null)){
    throw new Error('Missing data for company; cannot activate account')
  }

  // Enable on database
  await executeMutation(ENABLE_COMPANY_DOCUMENT_UPLOAD, {uuid: company.uuid})

  // Set up e-mail parameters
  const from = 'david.wyss@polygon-software.ch' // TODO set from .env
  const to: string = company.email ?? ''
  const subject = 'Your account' // TODO set
  const encodedUuid = btoa(company.uuid ?? ''); // Base64 encode UUID
  const baseUrl = process.env.VUE_APP_BASE_URL ??  ''
  const url = `${baseUrl}${ROUTES.DOCUMENT_UPLOAD.path}?cid=${encodedUuid}`
  const body = `Upload your documents at the following link:\n${url}`// TODO HTML mail template

  // Send e-mail
  await sendEmail(from, to, subject, body)

  hide()
}

function onReject(): void {
  //TODO: Send rejection message
  $q.dialog({
    title: 'Reject',
    component: RejectDialog,
  }).onOk(() => {
    // Hide outer popup
    hide()
  })
}

function onCancel(): void {
  hide()
}

</script>
