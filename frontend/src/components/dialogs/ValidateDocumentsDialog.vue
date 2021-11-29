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
          <q-item
            v-for="document in _company.documents"
            :key="document.uuid"
            v-ripple
          >
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ document.key }}</p>


<!--                TODO styling -->
                  <q-btn
                    v-if="document.url"
                    color="primary"
                    label="Herunterladen"
                    @click="openURL(document.url)"
                  />
              </div>
            </q-item-section>
          </q-item>

        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('dashboards.unlock_account')"
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
import {PRIVATE_FILE} from 'src/data/queries/QUERIES';
import {executeQuery} from 'src/helpers/data-helpers';
import _ from 'lodash';
import { openURL } from 'quasar'

const $q: QVueGlobals = useQuasar()

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  company: {
    type: Object as PropType<Company>,
    required: true
  },
})

// Clone prop so we can add URLs
const _company = ref(_.cloneDeep(props.company))

// Get URLs
void getUrls();

/**
 * Load all URLs and add to local object
 */
async function getUrls(): Promise<void>{
  const documents = _company.value.documents ?? [];
  for(const document of documents) {
    const queryResult = await executeQuery(PRIVATE_FILE, {uuid: document.uuid})
    const file = queryResult.data.getPrivateFile as Record<string, unknown>

    // Add to copy
    document.url = file.url;
  }
}

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
