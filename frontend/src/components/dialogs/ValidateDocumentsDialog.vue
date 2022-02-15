<template>
  <q-dialog
    ref="dialogRef"
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
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { PropType, ref} from 'vue'
import {QVueGlobals, useQuasar, openURL} from 'quasar';
import RejectApplicationDialog from 'components/dialogs/RejectApplicationDialog.vue'
import {Company} from 'src/data/types/Company';
import {executeMutation, executeQuery} from 'src/helpers/data-helpers';
import _ from 'lodash';
import {AuthenticationService} from 'src/services/AuthService';
import {ASSOCIATE_USER_TO_COMPANY, REJECT_COMPANY} from 'src/data/mutations/COMPANY';
import {ErrorService} from 'src/services/ErrorService';
import {i18n} from 'boot/i18n';
import {showNotification} from 'src/helpers/notification-helpers';
import DocumentPreviewDialog from 'src/components/dialogs/DocumentPreviewDialog.vue'
import {PRIVATE_FILE} from 'src/data/queries/FILE';
import { useDialogPluginComponent } from 'quasar'

const emit = defineEmits(useDialogPluginComponent.emits)

// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const $q: QVueGlobals = useQuasar()

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
 * @returns {Promise<void>} - done
 */
async function getUrls(): Promise<void>{
  const documents = _company.value.documents ?? [];
  for(const document of documents) {
    const queryResult = await executeQuery(PRIVATE_FILE, {uuid: document.uuid})
    const file = queryResult.data.getPrivateFile as Record<string, string>

    // Add to copy
    document.url = file.url;
  }
}



/**
 * On OK, create account and send e-mail
 * @returns {Promise<void>} - done
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

  onDialogOK()
}

/**
 * Triggered upon rejecting a company's application
 * @returns {void}
 */
function onReject(): void {
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
      // Hide outer popup
      onDialogHide()
    }).catch((error)=>{
      console.error(error)
      // Show confirmation prompt
      showNotification(
        $q,
        i18n.global.t('messages.rejection_failed'),
        undefined,
        'negative'
      )
    })
  })
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
