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
                <p class="col-7">{{ props.company.company_name }}</p>
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
import {QDialog, QVueGlobals, useQuasar} from 'quasar';
import RejectDialog from 'src/components/dialogs/RejectDialog.vue'
import {Company} from 'src/data/types/Company';
import {executeQuery} from 'src/helpers/data-helpers';
import {COMPANY} from 'src/data/queries/QUERIES';

const $q: QVueGlobals = useQuasar()

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  company: {
    type: Object as PropType<Company>,
    required: true
  },
})

const queryResult = executeQuery(COMPANY, {uuid: props.company.uuid})

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
 * On OK, create account and send e-mail
 */
function onOk(): void {
  // TODO unlock account

  //hide()
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
