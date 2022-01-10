<template>
  <q-page class="flex flex-center">
    <div class="column">

      <!-- Page Print Preview -->
      <q-card id="preview" class="page shadow-6">
        <div class="subpage">
          <!-- Logo + address row -->
          <div class="row justify-between">
            <img
              alt="S.O.I. AG"
              :src="require('src/assets/soi-logo.png')"
              style="height: 15mm"
              class="q-ma-sm"
            >
            <p class="text-grey-5" style="margin-top: 5mm">
              {{infoString}}
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
                  :content="contactInfo.fullName"
                />
                <DossierDocumentInfoField
                  :content="contactInfo.street"
                />
                <DossierDocumentInfoField
                  :content="`${contactInfo.zipCode} ${contactInfo.city}`"
                />
              </div>

              <!-- Right column -->
              <div
                class="column col-6"
                style="padding-left: 5mm"
              >
                <DossierDocumentInfoField
                  :label="$t('general.created_on')"
                  :content="formatDate(dossierInfo.createdOn)"
                />

                <DossierDocumentInfoField
                  :content="contactInfo.email"
                />

                <DossierDocumentInfoField
                  :content="contactInfo.phone"
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
                  :content="dossierInfo.originalBankName"
                />

                <DossierDocumentInfoField
                  :label="$t('dossier.purchase_price')"
                  :content="dossierInfo.purchasePrice.toLocaleString() + currency"
                />

                <DossierDocumentInfoField
                  :label="$t('dossier.current_value')"
                  :content="dossierInfo.currentValue.toLocaleString() + currency"
                />

                <DossierDocumentInfoField
                  :label="$t('dossier.current_mortgage')"
                  :content="dossierInfo.currentMortgage.toLocaleString() + currency"
                />

              </div>

              <!-- Right upper column -->
              <div
                class="column col-6"
                style="padding-left: 5mm"
              >
                <DossierDocumentInfoField
                  :label="$t('dossier.object_type')"
                  :content="dossierInfo.objectType"
                />

                <DossierDocumentInfoField
                  :label="$t('dossier.purchase_date')"
                  :content="formatDate(dossierInfo.purchaseDate)"
                />

                <!-- Spacer -->
                <div style="height: 11mm"/>

                <DossierDocumentInfoField
                  :label="$t('dossier.amortization_amount')"
                  :content="dossierInfo.amortizationAmount.toLocaleString() + currency"
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
                <DossierDocumentInfoField
                  v-for='(installment, index) in dossierInfo.installments'
                  :key="'installment_'+index"
                  :label="$t('dossier.installment') + ' ' + (index+1)"
                  :content="installment.amount.toLocaleString() + currency"
                />

                <DossierDocumentInfoField
                  :label="$t('dossier.lending_value')"
                  :content="dossierInfo.lendingValue + '%'"
                  bold
                />
              </div>
              <div
                class="column col-6"
                style="padding-left: 5mm"
              >
                <DossierDocumentInfoField
                  v-for='(installment, index) in dossierInfo.installments'
                  :key="'installment_'+ index"
                  :label="$t('dossier.expiration_date')"
                  :content="formatDate(installment.expirationDate)"
                />

                <DossierDocumentBooleanField
                  :value="dossierInfo.directAmortization"
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
                  :value="dossierInfo.renovated"
                  :label="$t('dossier.renovated')"
                />

                <DossierDocumentInfoField
                  v-if="dossierInfo.renovated"
                  :label="$t('dossier.renovation_amount')"
                  :content="dossierInfo.renovationAmount.toLocaleString() + currency"
                />
              </div>

              <!-- Right column -->
              <div
                class="column col-6"
                style="padding-left: 5mm"
              >
                <DossierDocumentInfoField
                  v-if="dossierInfo.renovated"
                  :label="$t('dossier.renovation_year')"
                  :content="dossierInfo.renovationDate.getFullYear()"
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
                <DossierDocumentInfoField
                  :label="$t('dossier.salary')"
                  :content="dossierInfo.salary.toLocaleString() + currency"
                  bold
                />

                <DossierDocumentInfoField
                  :label="$t('dossier.costs')"
                  :content="dossierInfo.costs.toLocaleString() + currency"
                />

                <DossierDocumentInfoField
                  :label="$t('dossier.sustainability')"
                  :content="dossierInfo.sustainability + '%'"
                  bold
                />
              </div>

              <!-- Right column -->
              <div
                class="column col-6"
                style="padding-left: 5mm"
              >
                <DossierDocumentBooleanField
                  :value="dossierInfo.buildingRight"
                  :label="$t('dossier.building_right')"
                />

                <DossierDocumentBooleanField
                  :value="dossierInfo.debtEnforcements"
                  :label="$t('dossier.debt_enforcements')"
                />

                <DossierDocumentBooleanField
                  :value="dossierInfo.lossCertificates"
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
          @click="goBack"
        />

        <q-btn
          :label="$t('buttons.send_by_email')"
          icon="mail_outline"
          color="primary"
          unelevated
          style="margin: 0 32px 0 16px"
          @click="sendDocument"
        />

        <q-btn
          :label="$t('buttons.print')"
          icon="print"
          color="primary"
          unelevated
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
import {executeMutation} from 'src/helpers/data-helpers';
import {uploadFiles} from 'src/helpers/file-helpers';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {generatePdf} from 'src/helpers/pdf-helpers';

const $q = useQuasar()

// Info for top right-hand corner
const infoString = 'Bahnhofstrasse 1 | 8001 Zürich | 043 222 22 22'
const currency = ' CHF'

// TODO replace with correct info from preceding form pages
const contactInfo = {
  fullName: 'Jusuf Amzai',
  email: 'email@adresse.ch',
  phone: '041 123 45 67',
  street: 'Sowiesostrasse 1',
  zipCode: '6003',
  city: 'Sowieso',
}

const dossierInfo = {
  uuid: 'ec308968-753a-4a2c-a7dc-3a8bac388a17', // Just an example... TODO
  createdOn: new Date(),
  originalBankName: 'CLER',
  purchasePrice: 1000000,
  purchaseDate: new Date(),
  currentValue: 1400000,
  currentMortgage: 700000,
  objectType: 'Wohnung',
  amortizationAmount: 8000,
  // TODO check for largest possible number of installments
  installments: [
    {
      amount: 700000,
      expirationDate: new Date,
    },
    {
      amount: 700000,
      expirationDate: new Date,
    }
  ],
  lendingValue: 54,
  directAmortization: true,
  renovated: true,
  renovationDate: new Date(),
  renovationAmount: 50000,
  salary: 200000,
  costs: 60000,
  sustainability: 29.5,
  buildingRight: false,
  debtEnforcements: false,
  lossCertificates: false
}

/**
 * Uploads the document as a PDF
 * @param {File} pdf - PDF file
 * @returns {Promise<string>} - uploaded PrivateFile's UUID
 */
async function uploadPdfDocument(){
  const dossierUuid = dossierInfo.uuid // TODO

  // Generate PDF file
  const pdf = await generatePdf('preview', `Dossier_${dossierUuid}`)

  const files = {
    finalDocument: pdf
  }
  // Upload document
  await uploadFiles(files, `/uploadDossierFile?did=${dossierUuid}`, 'getMyDossiers')
}

/**
 * Goes back to the previous form page
 * @returns {void}
 */
function goBack(){
  // TODO go to previous form page
}

/**
 * Sends the PDF by e-mail
 * @returns {Promise<void>} - done
 */
async function sendDocument(){

  // Generate PDF
  await uploadPdfDocument();

  const pdfUuid = 'todo' // TODO
  const addresses = [
    contactInfo.email,
    'david.wyss@polygon-software.ch' // TODO get own email address
  ]

  $q.dialog({
    component: DossierDocumentEmailDialog,
    componentProps: {
      addresses,
      pdfUuid
    }
  })
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
