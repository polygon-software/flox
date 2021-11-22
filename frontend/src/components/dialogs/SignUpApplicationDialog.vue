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
          <q-item-section v-ripple>
            <p>{{ $t('company_name') }}: {{ props.company_data.company_name }}</p>
          </q-item-section>
          <q-item-section>
            <p>{{ $t('language') }}: {{ props.company_data.language }}</p>
          </q-item-section>
          <q-item-section v-ripple>
            <p>{{ $t('company_uid') }}: {{ props.company_data.uid }}</p>
          </q-item-section>
          <q-item-section v-ripple>
            <p>{{ $t('full_name') }}: {{ props.company_data.person_name }}</p>
          </q-item-section>
          <q-item-section v-ripple>
            <p>{{ $t('living_address') }}: {{ props.company_data.domicile_address }}</p>
          </q-item-section>
          <q-item-section v-ripple>
            <p>{{ $t('correspondence_address') }}: {{ props.company_data.correspondence_address }}</p>
          </q-item-section>
          <q-item-section v-ripple>
            <p>{{ $t('phone_number') }}: {{ props.company_data.phone }}</p>
          </q-item-section>
          <q-item-section v-ripple>
            <p>{{ $t('email') }}: {{ props.company_data.email }}</p>
          </q-item-section>
          <q-item-section v-ripple>
            <p>{{ $t('branch_structure') }}: {{ props.company_data.branch_structure }}</p>
          </q-item-section>
        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn
          :label="$t('allow_upload')"
          color="primary"
          @click="onOkClick"
        />
        <q-btn
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

const dialog: Ref<HTMLElement> = ref<HTMLElement>(null)

type CompanyData = {
  company_name: {
    type: string,
  },
  langauge: {
    type: string,
  },
  uid: {
    type: string,
  },
  person_name: {
    type: string
  },
  domicile_address: {
    type: string //TODO: Change to correct type
  },
  correspondence_address: {
    type: string //TODO: Change to correct type
  },
  phone: {
    type: string
  },
  email: {
    type: string
  },
  branch_structure: {
    type: boolean
  },
}
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
