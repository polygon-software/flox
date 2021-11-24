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
                <p class="col-5">{{ $t('company_name') }}:</p>
                <p class="col-7">{{ props.companyData.company_name }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('language') }}:</p>
                <p class="col-7">{{ props.companyData.language }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('company_uid') }}:</p>
                <p class="col-7">{{ props.companyData.uid }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('full_name') }}:</p>
                <p class="col-7">{{ props.companyData.person_name }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('domicile_address') }}:</p>
                <p class="col-7">{{ props.companyData.domicile_address.prettyString() }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('correspondence_address') }}:</p>
                <p class="col-7">{{ props.companyData.correspondence_address.prettyString() }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('phone_number') }}:</p>
                <p class="col-7">{{ props.companyData.phone }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('email') }}:</p>
                <p class="col-7">{{ props.companyData.email }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('branch_structure') }}:</p>
                <p class="col-7">{{ props.companyData.branch_structure ? $t('yes') : $t('no') }}</p>
              </div>
            </q-item-section>
          </q-item>

        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('enable_upload')"
          color="primary"
          @click="onOk"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('reject')"
          color="negative"
          @click="onReject"
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
import {QDialog, useQuasar} from 'quasar';
import RejectDialog from 'src/components/dialogs/RejectDialog.vue'

const $q = useQuasar()

const dialog: Ref<QDialog> = ref<QDialog>(null)


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
  dialog.value.show();
}

function hide(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value.hide()
}

async function onOk(): Promise<void> {
  await executeMutation(ENABLE_COMPANY_DOCUMENT_UPLOAD, {uuid: props.companyData.uuid})
  hide()
}

function onReject(): void {
  //TODO: Send cancel message
  console.log('cancel')
  $q.dialog({
    title: 'Reject',
    component: RejectDialog,
  })
  hide()
}

</script>
