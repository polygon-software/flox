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
import {inject, PropType, ref, Ref} from 'vue'
import {QDialog, QVueGlobals, useQuasar} from 'quasar';
import RejectDialog from 'src/components/dialogs/RejectDialog.vue'
import {Company} from 'src/data/types/Company';
import {PRIVATE_FILE} from 'src/data/queries/QUERIES';
import {executeMutation, executeQuery} from 'src/helpers/data-helpers';
import _ from 'lodash';
import { openURL } from 'quasar'
import {AuthenticationService} from 'src/services/AuthService';
import {sendPasswordChangeEmail} from 'src/helpers/email-helpers';
import {SET_COGNITO_USER} from 'src/data/mutations/COMPANY';
import {randomPassword} from 'src/helpers/generator-helpers';
import {ErrorService} from 'src/services/ErrorService';
import {i18n} from 'boot/i18n';
import {showNotification} from 'src/helpers/notification-helpers';

const $q: QVueGlobals = useQuasar()
const $errorService: ErrorService|undefined = inject('$errorService')

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  company: {
    type: Object as PropType<Company>,
    required: true
  },
  authService: {
    type: AuthenticationService,
    required: true,
  }
})

// Clone prop so we can add URLs
const _company = ref(_.cloneDeep(props.company))

// Get URLs
void getUrls()

/**
 * Load all URLs and add to local object
 * TODO: Verify why this works only once
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
async function onOk(): Promise<void> {
  if([props.company.readable_id, props.company.email].some((val) => val === null || val === undefined)){
    $errorService?.showErrorDialog(new Error(i18n.global.t('errors.missing_attributes')))
  }

  const email = props.company.email ?? ''
  const password = randomPassword(9)
  const newUserId = await props.authService.signUpNewUser(
    email,
    email,
    password
  ).catch((e) => {
    console.log('gotsta error', e, $errorService) // TODO Error service seems to be undefined here
    $errorService?.showErrorDialog(e)
  })

  // Send one-time login e-mail
  await sendPasswordChangeEmail(email, password)

  // Set cognito ID on company
  await executeMutation(SET_COGNITO_USER, {
    uuid: props.company.uuid,
    cognito_id: newUserId
  })

  // TODO change owner of all the company's PrivateFiles to newUserId

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
 */
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
