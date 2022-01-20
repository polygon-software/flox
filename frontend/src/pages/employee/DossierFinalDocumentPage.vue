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
      <q-card
        id="preview"
        class="page shadow-6"
      >
        <div
          v-if="dossier"
          class="subpage"
        >
          <!-- Logo + address row -->
          <div class="row justify-between">
            <img
              alt="S.O.I. AG"
              :src="require('src/assets/soi-logo.png')"
              style="height: 15mm"
              class="q-ma-sm"
            >
            <p class="text-grey-5" style="margin-top: 5mm">
              {{ infoString }}
            </p>
          </div>

          <!-- Contact info card -->
          <q-card
            class="bg-grey-1 sub-card"
            flat
            style="margin-top: 5mm"
          >
            <strong style="margin-bottom: 1mm">
              {{$t('dossier.contact')}}
            </strong>

            <div class="row">
              <!-- Left column -->
              <div
                class="column col-6"
                style="padding-right: 5mm"
              >
                <DossierDocumentInfoField
                  :content="`${dossier.first_name} ${dossier.last_name}`"
                />
                <DossierDocumentInfoField
                  :content="dossier.address.street"
                />
                <DossierDocumentInfoField
                  :content="`${dossier.address.zip_code} ${dossier.address.city}`"
                />
              </div>

              <!-- Right column -->
              <div
                class="column col-6"
                style="padding-left: 5mm"
              >
                <DossierDocumentInfoField
                  :label="$t('general.created_on')"
                  :content="formatDate(dossier.created_at)"
                />

                <DossierDocumentInfoField
                  :content="dossier.email"
                />

                <DossierDocumentInfoField
                  :content="dossier.phone"
                />
              </div>
            </div>
          </q-card>

          <!-- Application info card -->
          <q-card
            flat
            class="bg-grey-1 sub-card"
          >
            <strong>
              {{$t('dossier.application')}}
            </strong>

            <!-- First section: general info -->
            <div class="row">
              <!-- Left upper column -->
              <div
                class="column col-6"
                style="padding-right: 5mm"
              >
                <DossierDocumentInfoField
                  :label="$t('dossier.original_bank')"
                  :content="dossier.original_bank.name"
                />

                <DossierDocumentInfoField
                  :label="$t('dossier.purchase_price')"
                  :content="dossier.purchase_price.toLocaleString() + currency"
                />

                <DossierDocumentInfoField
                  :label="$t('dossier.current_value')"
                  :content="dossier.market_value_estimation.toLocaleString() + currency"
                />

                <DossierDocumentInfoField
                  :label="$t('dossier.current_mortgage')"
                  :content="dossier.mortgage_amount.toLocaleString() + currency"
                />

              </div>

              <!-- Right upper column -->
              <div
                class="column col-6"
                style="padding-left: 5mm"
              >
                <DossierDocumentInfoField
                  :label="$t('dossier.object_type')"
                  :content="$t(`property_type_enum.${dossier.property_type}`)"
                />

                <DossierDocumentInfoField
                  :label="$t('dossier.purchase_date')"
                  :content="formatDate(dossier.purchase_date)"
                />

                <!-- Spacer -->
                <div style="height: 11mm"/>

                <DossierDocumentInfoField
                  :label="$t('dossier.amortization_amount')"
                  :content="dossier.has_amortisation ? dossier.amortisation_amount.toLocaleString() + currency : '-'"
                />
              </div>
            </div>

            <div class="dotted-line"/>

            <!-- Second section: mortgage installments -->
            <div class="row">
              <div
                class="column col-6"
                style="padding-right: 5mm"
              >
                <!-- TODO re-enable once fixed -->
<!--                <DossierDocumentInfoField-->
<!--                  v-for='(installment, index) in dossierInfo.installments'-->
<!--                  :key="'installment_'+index"-->
<!--                  :label="$t('dossier.installment') + ' ' + (index+1)"-->
<!--                  :content="installment.amount.toLocaleString() + currency"-->
<!--                />-->

                <!-- Enfeoffment -->
                <DossierDocumentInfoField
                  :label="$t('dossier.lending_value')"
                  :content="dossier.enfeoffment_estimate_low + '%'"
                  bold
                />
              </div>
              <div
                class="column col-6"
                style="padding-left: 5mm"
              >
                <!-- TODO re-enable -->
<!--                <DossierDocumentInfoField-->
<!--                  v-for='(installment, index) in dossierInfo.installments'-->
<!--                  :key="'installment_'+ index"-->
<!--                  :label="$t('dossier.expiration_date')"-->
<!--                  :content="formatDate(installment.expirationDate)"-->
<!--                />-->

                <DossierDocumentBooleanField
                  v-if="dossier.has_amortisation"
                  :value="dossier.direct_amortisation"
                  :label="$t('dossier.amortization_type')"
                  :true-label="$t('dossier.direct')"
                  :false-label="$t('dossier.indirect')"
                />
              </div>
            </div>

            <q-separator
              color="grey-6"
              style="margin: 3mm 0 3mm 0"
            />

            <!-- Third section: renovation info -->
            <div class="row">
              <!-- Left column -->
              <div
                class="column col-6"
                style="padding-right: 5mm"
              >

                <DossierDocumentBooleanField
                  :value="dossier.has_renovation"
                  :label="$t('dossier.renovated')"
                />

                <DossierDocumentInfoField
                  v-if="dossier.has_renovation"
                  :label="$t('dossier.renovation_amount')"
                  :content="dossier.renovation_price.toLocaleString() + currency"
                />
              </div>

              <!-- Right column -->
              <div
                class="column col-6"
                style="padding-left: 5mm"
              >
                <DossierDocumentInfoField
                  v-if="dossier.has_renovation"
                  :label="$t('dossier.renovation_year')"
                  :content="dossier.renovation_year"
                />
              </div>
            </div>

            <q-separator
              color="grey-6"
              style="margin: 3mm 0 3mm 0"
            />

            <!-- Fourth section: salary/general info -->
            <div class="row">
              <!-- Left column -->
              <div
                class="column col-6"
                style="padding-right: 5mm"
              >
                <!-- Eligible income -->
                <DossierDocumentInfoField
                  :label="$t('dossier.salary')"
                  :content="dossier.eligible_income.toLocaleString() + currency"
                  bold
                />

                <!-- Total costs -->
                <DossierDocumentInfoField
                  :label="$t('dossier.costs')"
                  :content="dossier.total_costs.toLocaleString() + currency"
                />

                <!-- Affordability -->
                <DossierDocumentInfoField
                  :label="$t('dossier.sustainability')"
                  :content="dossier.affordability + '%'"
                  bold
                />
              </div>

              <!-- Right column -->
              <div
                class="column col-6"
                style="padding-left: 5mm"
              >
                <DossierDocumentBooleanField
                  :value="dossier.has_building_lease"
                  :label="$t('dossier.building_right')"
                />

                <DossierDocumentBooleanField
                  :value="dossier.prosecutions"
                  :label="$t('dossier.debt_enforcements')"
                />

                <DossierDocumentBooleanField
                  :value="dossier.loss_certificates"
                  :label="$t('dossier.loss_certificates')"
                />
              </div>
            </div>



          </q-card>

          <!-- Signature line -->
          <div
            class="row justify-end"
            style="margin-top: 10mm"
          >
            <div class="column">
              <p>
                {{ $t('dossier.customer_confirms') }}
              </p>

              <!-- Signature line -->
              <div
                style="border: none; border-bottom: 1px solid black; width: 90mm; margin-top: 12mm"
              />
            </div>
          </div>
        </div>
      </q-card>

      <!-- Button row -->
      <div
        class="row justify-center button-row"
        style="margin-bottom: 128px"
      >
        <q-btn
          :label="$t('buttons.back')"
          color="primary"
          flat
          :disable="loading"
          @click="goBack"
        />

        <q-btn
          :label="$t('buttons.send_by_email')"
          icon="mail_outline"
          color="primary"
          unelevated
          :disable="loading || !dossier || !fileUuid"
          style="margin: 0 32px 0 16px"
          @click="sendDocument"
        />

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
import {formatDate} from 'src/helpers/format-helpers';
import DossierDocumentInfoField from 'components/dossier/DossierDocumentInfoField.vue';
import DossierDocumentBooleanField from 'components/dossier/DossierDocumentBooleanField.vue';
import DossierDocumentEmailDialog from 'components/dialogs/DossierDocumentEmailDialog.vue';
import {useQuasar} from 'quasar';
import {uploadFiles} from 'src/helpers/file-helpers';
import {generatePdf} from 'src/helpers/pdf-helpers';
import {onMounted, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import {executeQuery} from 'src/helpers/data-helpers';
import {GET_DOSSIER} from 'src/data/queries/DOSSIER';

const $q = useQuasar()
const route = useRoute()


const dossierUuid = route.query.did as string
const dossier = ref(null)

const loading = ref(false) // TODO set to true once document upload dunzo
const fileUuid: Ref<string|null> = ref(null)

// Info for top right-hand corner
const infoString = 'Bahnhofstrasse 1 | 8001 Zürich | 043 222 22 22'
const currency = ' CHF'

//On mount, generate PDF
onMounted(async () => {
  // TODO error if no UUID given

  const dossierQueryResult = await executeQuery(GET_DOSSIER, {uuid: dossierUuid})

  dossier.value = dossierQueryResult.data.getDossier

  // Upload PDF document
  // await uploadPdfDocument()
})

/**
 * Uploads the document as a PDF (done on page load)
 * @returns {Promise<string>} - uploaded PrivateFile's UUID
 */
async function uploadPdfDocument(){
  // Generate PDF file
  const pdfFile = await generatePdf('preview', `Dossier_${dossierUuid}`);

  // Prepare for upload
  const files = {
    finalDocument: pdfFile
  }

  // Upload document (replaces existing finalDocument, if any)
  const uploadResponse: Record<string, unknown> = await uploadFiles(files, `/uploadDossierFinalDocument?did=${dossierUuid}`, 'getMyDossiers')

  // Get actual file
  const newPdf: Record<string, unknown> = uploadResponse.finalDocument as Record<string, unknown>

  // Store to local variable & set loading state
  fileUuid.value = newPdf.uuid as string
  loading.value = false
}

/**
 * Goes back to the previous form page
 * @returns {void}
 */
function goBack(){
  // TODO go to previous form page
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
