<template>
  <q-dialog
    ref="dialogRef"
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
                <p class="col-7">{{ domicileAddress.prettyString() }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.correspondence_address') }}:</p>
                <p class="col-7">{{ correspondenceAddress.prettyString() }}</p>
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

          <q-item v-ripple clickable>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.email') }}:</p>
                <p class="col-7">
                  {{ email }}
                  <q-item-label caption>({{ $t('general.editable') }})</q-item-label>
                </p>
                <q-popup-edit
                  v-slot="scope"
                  :auto-save="false"
                  :model-value="email"
                  buttons
                  @save="(value) => onChangeEmail(value)"
                >
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    counter
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
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
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {defineEmits, PropType, ref} from 'vue'
import { Company } from 'src/data/types/Company'
import {executeMutation} from 'src/helpers/data-helpers';
import {
  ENABLE_COMPANY_DOCUMENT_UPLOAD,
  REJECT_COMPANY,
  UPDATE_COMPANY_EMAIL
} from 'src/data/mutations/COMPANY';
import { QVueGlobals, useQuasar} from 'quasar';
import RejectApplicationDialog from 'components/dialogs/RejectApplicationDialog.vue'
import {Address} from 'src/data/types/Address';
import {sendDocumentUploadEmail} from 'src/helpers/email-helpers';
import {showNotification} from 'src/helpers/notification-helpers';
import {i18n} from 'boot/i18n';
import { useDialogPluginComponent } from 'quasar'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(useDialogPluginComponent.emits)

// REQUIRED; must be called inside of setup()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()


const $q: QVueGlobals = useQuasar()

const props = defineProps({
  company: {
    type: Object as PropType<Company>,
    required: true
  },
})

// E-mail as a separate value, since it's editable
const email = ref(props.company.email)

// Convert addresses to actual address instances
const domicileAddress = new Address(
  props.company.domicile_address?.street?? undefined,
  props.company.domicile_address?.number ?? undefined,
  props.company.domicile_address?.city ?? undefined,
  props.company.domicile_address?.zip_code ?? undefined,
)
const correspondenceAddress = new Address(
  props.company.correspondence_address?.street ?? undefined,
  props.company.correspondence_address?.number ?? undefined,
  props.company.correspondence_address?.city ?? undefined,
  props.company.correspondence_address?.zip_code ?? undefined,
)

/**
 * On OK, enable document upload for the company and send e-mail
 * @returns {Promise<void>} - done
 */
async function onOk(): Promise<void> {
  // Verify all required attributes present
  const company = props.company
  if([company, company.uuid, company.email].some((value) => value === undefined || value === null)){
    throw new Error('Missing data for company; cannot activate account')
  }

  // Enable on database
  await executeMutation(ENABLE_COMPANY_DOCUMENT_UPLOAD, {uuid: company.uuid})

  // Send document upload e-mail
  await sendDocumentUploadEmail(company.email ?? '', company.uuid ?? '')

  // Show confirmation prompt
  showNotification(
    $q,
    i18n.global.t('messages.document_upload_enabled'),
    undefined,
    'positive'
  )

  onDialogOK()
}

/**
 * Executed upon rejecting a company application
 * @returns {void}
 */
function onReject(): void {
  //TODO: Send rejection E-mail
  $q.dialog({
    title: 'Reject',
    component: RejectApplicationDialog,
  }).onOk(() => {
    // Remove company application on DB
    executeMutation(REJECT_COMPANY, {uuid: props.company.uuid}).then(() => {
      // Show notification
      showNotification(
        $q,
        i18n.global.t('messages.application_rejected'),
        undefined,
        'primary'
      )
      onDialogCancel()
    }).catch((error)=>{
      console.error(error) // Todo Toast
    })
  })
}

/**
 * Changes a company's e-mail address to a new one
 * @param {string} newEmail - the e-mail address to change to
 * @returns {Promise<void>} - done
 */
async function onChangeEmail(newEmail: string): Promise<void>{
  await executeMutation(
    UPDATE_COMPANY_EMAIL,
    {
      uuid: props.company.uuid,
      email: newEmail
    })

  // Update in own prop to reflect changed state
  email.value = newEmail
}
</script>
