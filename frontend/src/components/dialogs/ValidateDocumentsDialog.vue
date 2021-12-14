<template>
  <q-dialog
    ref="dialog"
    title="Application"
  >
    <q-card style="min-width: 600px; max-width: 80%;">
      <q-card-section>
        <q-list
          bordered
          separator
        >
          <q-item
            v-for="document in _company.documents"
            :key="document.uuid"
          >
            <q-item-section>
              <div class="row flex justify-between content-center" style="height: 50px">
                <!-- File name (Key is composed of UUID + file name, thus remove UUID) -->
                <p class="col-8">{{ document.key.substring(37) }}</p>

                <!-- Buttons -->
                <div
                  v-if="document.url"
                  class="col-4"
                >
                  <q-btn
                    color="primary"
                    :label="$t('buttons.preview')"
                    @click="openPreview(document.url)"
                  />
                  <q-btn
                    style="margin-left: 12px"
                    color="primary"
                    icon="download"
                    @click="openURL(document.url)"
                  />
                </div>

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
import { PropType, ref, Ref} from 'vue'
import {QDialog, QVueGlobals, useQuasar} from 'quasar';
import RejectDialog from 'src/components/dialogs/RejectDialog.vue'
import {Company} from 'src/data/types/Company';
import {PRIVATE_FILE} from 'src/data/queries/QUERIES';
import {executeMutation, executeQuery} from 'src/helpers/data-helpers';
import _ from 'lodash';
import {AuthenticationService} from 'src/services/AuthService';
import { DELETE_COMPANY, ASSOCIATE_USER_TO_COMPANY} from 'src/data/mutations/COMPANY';
import {ErrorService} from 'src/services/ErrorService';
import {i18n} from 'boot/i18n';
import {showNotification} from 'src/helpers/notification-helpers';
import DocumentPreviewDialog from 'src/components/dialogs/DocumentPreviewDialog.vue'
import {openURL} from 'quasar';

const $q: QVueGlobals = useQuasar()

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  company: {
    type: Object as PropType<Company>,
    required: true
  },
  authService: {
    type: AuthenticationService,
    required: true,
  },
  errorService: {
    type: ErrorService,
    required: true
  }
})

// Clone prop so we can add URLs
const _company = ref(_.cloneDeep(props.company))

// Get URLs
void getUrls()

/**
 * Load all URLs and add to local object
 * TODO: Verify why this works only once
 * @async
 * @returns {void}
 */
async function getUrls(): Promise<void>{
  const documents = _company.value.documents ?? [];
  for(const document of documents) {
    const queryResult = await executeQuery(PRIVATE_FILE, {uuid: document.uuid})
    const file = queryResult.data.getPrivateFile as unknown as Record<string, unknown>

    // Add to copy
    document.url = file.url;
  }
}

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
 * On OK, create account and send e-mail
 * @async
 * @returns {void}
 */
async function onOk(): Promise<void> {
  if([props.company.readable_id, props.company.email].some((val) => val === null || val === undefined)){
    props.errorService?.showErrorDialog(new Error(i18n.global.t('errors.missing_attributes')))
  }

  await executeMutation(ASSOCIATE_USER_TO_COMPANY, {
    uuid: props.company.uuid
  })


  // Show confirmation prompt
  showNotification(
    $q,
    i18n.global.t('messages.account_unlocked'),
    undefined,
    'positive'
  )

  hide()

}

/**
 * Triggered upon rejecting a company's application
 * @returns {void}
 */
function onReject(): void {
  //TODO: Send rejection message
  $q.dialog({
    title: 'Reject',
    component: RejectDialog,
  }).onOk(() => {
    // Remove company application on DB
    void executeMutation(DELETE_COMPANY, {uuid: props.company.uuid}).then(() => {
      // Show notification
      showNotification(
        $q,
        i18n.global.t('messages.application_rejected'),
        undefined,
        'primary'
      )
      // Hide outer popup
      hide()
    })
  })
}

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}

/**
 * Open the a preview of the selected document in a dialog.
 * @param {string} url - The url of the file that should be displayed.
 * @returns {void}
 */
function openPreview(url: string): void {
  $q.dialog({
    title: 'Preview',
    component: DocumentPreviewDialog,
    componentProps: {
      url: url
    }
  })
}
</script>
