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
                <p class="col-7">{{ props.company_data.company_name }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('language') }}:</p>
                <p class="col-7">{{ props.company_data.language }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('company_uid') }}:</p>
                <p class="col-7">{{ props.company_data.uid }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('full_name') }}:</p>
                <p class="col-7">{{ props.company_data.person_name }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('domicile_address') }}:</p>
                <p class="col-7">{{ props.company_data.domicile_address.prettyString() }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('correspondence_address') }}:</p>
                <p class="col-7">{{ props.company_data.correspondence_address.prettyString() }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('phone_number') }}:</p>
                <p class="col-7">{{ props.company_data.phone }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('email') }}:</p>
                <p class="col-7">{{ props.company_data.email }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('branch_structure') }}:</p>
                <p class="col-7">{{ props.company_data.branch_structure ? $t('yes') : $t('no') }}</p>
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
          @click="onOkClick"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('reject')"
          color="negative"
          @click="onCancelClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {PropType, ref, Ref} from 'vue'
import { CompanyData } from 'src/data/types/CompanyData'

const dialog: Ref<HTMLElement> = ref<HTMLElement>(null)


const props = defineProps({
  company_data: {
    type: Object as PropType<CompanyData>,
    required: true
  }
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

function onOkClick(): void {
  //TODO: Send ok
  console.log('ok')
  hide()
}

function onCancelClick(): void {
  //TODO: Send cancel message
  console.log('cancel')
  hide()
}

</script>
