<template>
  <q-dialog
    ref="dialog"
    title="Application"
  >
    <q-card>
      <q-card-section>
        <q-list
          bordered
          separator
        >
          <q-item v-ripple>
            <q-item-section >
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.company_name') }}:</p>
                <p class="col-7">{{ props.companyData.company_name }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.language') }}:</p>
                <p class="col-7">{{ props.companyData.language }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.company_uid') }}:</p>
                <p class="col-7">{{ props.companyData.uid }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.full_name') }}:</p>
                <p class="col-7">{{ props.companyData.person_name }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.domicile_address') }}:</p>
                <p class="col-7">{{ props.companyData.domicile_address.prettyString() }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.correspondence_address') }}:</p>
                <p class="col-7">{{ props.companyData.correspondence_address.prettyString() }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.phone_number') }}:</p>
                <p class="col-7">{{ props.companyData.phone }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.email') }}:</p>
                <p class="col-7">{{ props.companyData.email }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.branch_structure') }}:</p>
                <p class="col-7">{{ props.companyData.branch_structure ? $t('yes') : $t('no') }}</p>
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

const $q: QVueGlobals = useQuasar()

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

async function onOk(): Promise<void> {
  await executeMutation(ENABLE_COMPANY_DOCUMENT_UPLOAD, {uuid: props.companyData.uuid})
  hide()
}

function onReject(): void {
  //TODO: Send cancel message
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
