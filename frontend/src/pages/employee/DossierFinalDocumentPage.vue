<template>
  <q-page class="flex flex-center content-start">
    <div class="column">
      <!-- Loading overlay -->
      <div
        v-if="loading"
        class="page flex flex-center loading-indicator"
      >
        <div class="column">
          <q-spinner
            size="50px"
            color="white"
          />
          <h6 class="text-white">
            {{ $t('general.loading') }}
          </h6>
        </div>
      </div>

      <!-- Page Print Preview -->
      <DossierFinalDocumentPreview :dossier="dossier"/>

      <!-- Button row -->
      <div
        class="row justify-center button-row"
        style="margin-bottom: 128px"
      >
        <!-- Back to dashboard -->
        <q-btn
          :label="$t('buttons.back_to_dashboard')"
          color="primary"
          flat
          :disable="loading || !dossier || !fileUuid"
          @click="goBack"
        />

        <!-- Send by e-mail -->
        <q-btn
          :label="$t('buttons.send_by_email')"
          icon="mail_outline"
          color="primary"
          unelevated
          :disable="loading || !dossier || !fileUuid"
          style="margin: 0 32px 0 16px"
          @click="sendDocument"
        />

        <!-- Print -->
        <q-btn
          :label="$t('buttons.print')"
          icon="print"
          color="primary"
          unelevated
          :disable="loading || !dossier"
          @click="printDocument"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import DossierDocumentEmailDialog from 'components/dialogs/DossierDocumentEmailDialog.vue';
import {useQuasar} from 'quasar';
import {uploadFiles} from 'src/helpers/file-helpers';
import {generatePdf} from 'src/helpers/pdf-helpers';
import {inject, onMounted, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import {executeQuery} from 'src/helpers/data-helpers';
import {GET_DOSSIER} from 'src/data/queries/DOSSIER';
import {i18n} from 'boot/i18n';
import {ErrorService} from 'src/services/ErrorService';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {sleep} from 'src/helpers/general-helpers';
import DossierFinalDocumentPreview from 'components/dossier/DossierFinalDocumentPreview.vue';

const $q = useQuasar()
const route = useRoute()
const $errorService: ErrorService|undefined = inject('$errorService')
const $routerService: RouterService|undefined = inject('$routerService')

const dossierUuid = route.query.did as string
const dossier: Ref<Record<string, unknown>|null> = ref(null)

const loading = ref(true)
const fileUuid: Ref<string|null> = ref(null)

//On mount, generate PDF
onMounted(async () => {
  // Ensure link gives a UUID
  if(!dossierUuid){
    // Show error
    $errorService?.showErrorDialog(
      new Error(i18n.global.t('errors.invalid_link'))
    )
  }
  const dossierQueryResult = await executeQuery(GET_DOSSIER, {uuid: dossierUuid})

  dossier.value = dossierQueryResult.data?.getDossier

  // Ensure dossier loaded correctly
  if(!dossier.value){
    // Show error
    $errorService?.showErrorDialog(
      new Error(i18n.global.t('errors.invalid_link'))
    )
  }

  await sleep(100)

  // Upload PDF document
  await uploadPdfDocument()

  loading.value = false
})

/**
 * Uploads the document as a PDF (done on page load)
 * @returns {Promise<string>} - uploaded PrivateFile's UUID
 */
async function uploadPdfDocument(){
  // Generate PDF file
  let pdfFile = await generatePdf('preview', `Dossier_${dossierUuid}`);

  // Prepare for upload
  const files = {
    finalDocument: pdfFile
  }

  // Upload document (replaces existing finalDocument, if any)
  const uploadResponse: Record<string, unknown> = await uploadFiles(files, `/uploadDossierFinalDocument?did=${dossierUuid}`, 'getMyDossiers')

  // Get actual file
  const updatedDossier: Record<string, unknown> = uploadResponse

  // Store to local variable & set loading state
  fileUuid.value = updatedDossier.final_document.uuid as string
}

/**
 * Goes back to the previous form page
 * @returns {Promise<void>} - done
 */
async function goBack(){
  await $routerService?.routeTo(ROUTES.EMPLOYEE_DASHBOARD)
}

/**
 * Opens a dialog for sending the PDF by e-mail
 * @returns {Promise<void>} - done
 */
function sendDocument(){
  if(dossier.value && fileUuid.value){
    const addresses = [
      dossier.value.email,                                      // Customer e-mail
      (dossier.value.employee as Record<string, string>).email, // Employee (broker) email
    ]

    // Open upload dialog
    $q.dialog({
      component: DossierDocumentEmailDialog,
      componentProps: {
        uuid: dossierUuid,
        addresses,
        fileUuid: fileUuid.value
      }
    })
  }
}

/**
 * Opens print dialog for the generated document
 * @returns {void}
 */
function printDocument(){
  window.print()
}

</script>

<style scoped>
/* Important: Measurements herein are in mm instead of px/em for printing reasons */
.page {
  width: 210mm;
  min-height: 297mm;
  margin: 15mm auto;
  padding: 0;
  /* Force printing light-grey backgrounds, since print dialog will remove bg color by default */
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
}

.subpage {
  padding: .5cm 1cm .5cm 1cm;
  height: 257mm;
}

.sub-card{
  padding: 5mm;
  margin-bottom: 3mm;
}

.dotted-line{
  border: none;
  border-top: 1px dotted lightgrey;
  margin: 3mm 0 3mm 0
}

/* Loading overlay */
.loading-indicator{
  position: absolute;
  z-index: 10;
  border-radius: 5px;
  background-color: rgba(50, 50, 50, 0.6);
  backdrop-filter: blur(5px);
}

@page {
  size: A4;
  margin: 0;
}

@media print {
  html, body {
    width: 210mm;
    height: 297mm;
    margin: 0 !important;
    padding: 0 !important;
  }

  .page {
    height: 100% !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    position: fixed;
    top: 0;
    left: 0;
  }

  .button-row{
    display: none;
  }
}
</style>
