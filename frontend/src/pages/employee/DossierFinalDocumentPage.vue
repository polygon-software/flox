<template>
  <q-page class="flex flex-center content-start">
<!--    <div class="column">-->

<!--      &lt;!&ndash; Loading overlay &ndash;&gt;-->
<!--      <div-->
<!--        v-if="loading"-->
<!--        class="page flex flex-center loading-indicator"-->
<!--      >-->
<!--        <div class="column">-->
<!--          <q-spinner-->
<!--            size="50px"-->
<!--            color="white"-->
<!--          />-->
<!--          <h6 class="text-white">-->
<!--            {{ $t('general.loading') }}-->
<!--          </h6>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; Page Print Preview &ndash;&gt;-->
<!--      <q-card-->
<!--        id="preview"-->
<!--        class="page shadow-6"-->
<!--      >-->
<!--        <div class="subpage">-->
<!--          &lt;!&ndash; Logo + address row &ndash;&gt;-->
<!--          <div class="row justify-between">-->
<!--            <img-->
<!--              alt="S.O.I. AG"-->
<!--              :src="require('src/assets/soi-logo.png')"-->
<!--              style="height: 15mm"-->
<!--              class="q-ma-sm"-->
<!--            >-->
<!--            <p class="text-grey-5" style="margin-top: 5mm">-->
<!--              {{infoString}}-->
<!--            </p>-->
<!--          </div>-->

<!--          &lt;!&ndash; Contact info card &ndash;&gt;-->
<!--          <q-card-->
<!--            class="bg-grey-1 sub-card"-->
<!--            flat-->
<!--            style="margin-top: 5mm"-->
<!--          >-->
<!--            <strong style="margin-bottom: 1mm">-->
<!--              {{$t('dossier.contact')}}-->
<!--            </strong>-->

<!--            <div class="row">-->
<!--              &lt;!&ndash; Left column &ndash;&gt;-->
<!--              <div-->
<!--                class="column col-6"-->
<!--                style="padding-right: 5mm"-->
<!--              >-->
<!--                <DossierDocumentInfoField-->
<!--                  :content="contactInfo.fullName"-->
<!--                />-->
<!--                <DossierDocumentInfoField-->
<!--                  :content="contactInfo.street"-->
<!--                />-->
<!--                <DossierDocumentInfoField-->
<!--                  :content="`${contactInfo.zipCode} ${contactInfo.city}`"-->
<!--                />-->
<!--              </div>-->

<!--              &lt;!&ndash; Right column &ndash;&gt;-->
<!--              <div-->
<!--                class="column col-6"-->
<!--                style="padding-left: 5mm"-->
<!--              >-->
<!--                <DossierDocumentInfoField-->
<!--                  :label="$t('general.created_on')"-->
<!--                  :content="formatDate(dossierInfo.createdOn)"-->
<!--                />-->

<!--                <DossierDocumentInfoField-->
<!--                  :content="contactInfo.email"-->
<!--                />-->

<!--                <DossierDocumentInfoField-->
<!--                  :content="contactInfo.phone"-->
<!--                />-->
<!--              </div>-->
<!--            </div>-->
<!--          </q-card>-->

<!--          &lt;!&ndash; Application info card &ndash;&gt;-->
<!--          <q-card-->
<!--            flat-->
<!--            class="bg-grey-1 sub-card"-->
<!--          >-->
<!--            <strong>-->
<!--              {{$t('dossier.application')}}-->
<!--            </strong>-->

<!--            &lt;!&ndash; First section: general info &ndash;&gt;-->
<!--            <div class="row">-->
<!--              &lt;!&ndash; Left upper column &ndash;&gt;-->
<!--              <div-->
<!--                class="column col-6"-->
<!--                style="padding-right: 5mm"-->
<!--              >-->
<!--                <DossierDocumentInfoField-->
<!--                  :label="$t('dossier.original_bank')"-->
<!--                  :content="dossierInfo.originalBankName"-->
<!--                />-->

<!--                <DossierDocumentInfoField-->
<!--                  :label="$t('dossier.purchase_price')"-->
<!--                  :content="dossierInfo.purchasePrice.toLocaleString() + currency"-->
<!--                />-->

<!--                <DossierDocumentInfoField-->
<!--                  :label="$t('dossier.current_value')"-->
<!--                  :content="dossierInfo.currentValue.toLocaleString() + currency"-->
<!--                />-->

<!--                <DossierDocumentInfoField-->
<!--                  :label="$t('dossier.current_mortgage')"-->
<!--                  :content="dossierInfo.currentMortgage.toLocaleString() + currency"-->
<!--                />-->

<!--              </div>-->

<!--              &lt;!&ndash; Right upper column &ndash;&gt;-->
<!--              <div-->
<!--                class="column col-6"-->
<!--                style="padding-left: 5mm"-->
<!--              >-->
<!--                <DossierDocumentInfoField-->
<!--                  :label="$t('dossier.object_type')"-->
<!--                  :content="dossierInfo.objectType"-->
<!--                />-->

<!--                <DossierDocumentInfoField-->
<!--                  :label="$t('dossier.purchase_date')"-->
<!--                  :content="formatDate(dossierInfo.purchaseDate)"-->
<!--                />-->

<!--                &lt;!&ndash; Spacer &ndash;&gt;-->
<!--                <div style="height: 11mm"/>-->

<!--                <DossierDocumentInfoField-->
<!--                  :label="$t('dossier.amortization_amount')"-->
<!--                  :content="dossierInfo.amortizationAmount.toLocaleString() + currency"-->
<!--                />-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="dotted-line"/>-->

<!--            &lt;!&ndash; Second section: mortgage installments &ndash;&gt;-->
<!--            <div class="row">-->
<!--              <div-->
<!--                class="column col-6"-->
<!--                style="padding-right: 5mm"-->
<!--              >-->
<!--                <DossierDocumentInfoField-->
<!--                  v-for='(installment, index) in dossierInfo.installments'-->
<!--                  :key="'installment_'+index"-->
<!--                  :label="$t('dossier.installment') + ' ' + (index+1)"-->
<!--                  :content="installment.amount.toLocaleString() + currency"-->
<!--                />-->

<!--                <DossierDocumentInfoField-->
<!--                  :label="$t('dossier.lending_value')"-->
<!--                  :content="dossierInfo.lendingValue + '%'"-->
<!--                  bold-->
<!--                />-->
<!--              </div>-->
<!--              <div-->
<!--                class="column col-6"-->
<!--                style="padding-left: 5mm"-->
<!--              >-->
<!--                <DossierDocumentInfoField-->
<!--                  v-for='(installment, index) in dossierInfo.installments'-->
<!--                  :key="'installment_'+ index"-->
<!--                  :label="$t('dossier.expiration_date')"-->
<!--                  :content="formatDate(installment.expirationDate)"-->
<!--                />-->

<!--                <DossierDocumentBooleanField-->
<!--                  :value="dossierInfo.directAmortization"-->
<!--                  :label="$t('dossier.amortization_type')"-->
<!--                  :true-label="$t('dossier.direct')"-->
<!--                  :false-label="$t('dossier.indirect')"-->
<!--                />-->
<!--              </div>-->
<!--            </div>-->

<!--            <q-separator-->
<!--              color="grey-6"-->
<!--              style="margin: 3mm 0 3mm 0"-->
<!--            />-->

<!--            &lt;!&ndash; Third section: renovation info &ndash;&gt;-->
<!--            <div class="row">-->
<!--              &lt;!&ndash; Left column &ndash;&gt;-->
<!--              <div-->
<!--                class="column col-6"-->
<!--                style="padding-right: 5mm"-->
<!--              >-->

<!--                <DossierDocumentBooleanField-->
<!--                  :value="dossierInfo.renovated"-->
<!--                  :label="$t('dossier.renovated')"-->
<!--                />-->

<!--                <DossierDocumentInfoField-->
<!--                  v-if="dossierInfo.renovated"-->
<!--                  :label="$t('dossier.renovation_amount')"-->
<!--                  :content="dossierInfo.renovationAmount.toLocaleString() + currency"-->
<!--                />-->
<!--              </div>-->

<!--              &lt;!&ndash; Right column &ndash;&gt;-->
<!--              <div-->
<!--                class="column col-6"-->
<!--                style="padding-left: 5mm"-->
<!--              >-->
<!--                <DossierDocumentInfoField-->
<!--                  v-if="dossierInfo.renovated"-->
<!--                  :label="$t('dossier.renovation_year')"-->
<!--                  :content="dossierInfo.renovationDate.getFullYear()"-->
<!--                />-->
<!--              </div>-->
<!--            </div>-->

<!--            <q-separator-->
<!--              color="grey-6"-->
<!--              style="margin: 3mm 0 3mm 0"-->
<!--            />-->

<!--            &lt;!&ndash; Fourth section: salary/general info &ndash;&gt;-->
<!--            <div class="row">-->
<!--              &lt;!&ndash; Left column &ndash;&gt;-->
<!--              <div-->
<!--                class="column col-6"-->
<!--                style="padding-right: 5mm"-->
<!--              >-->
<!--                <DossierDocumentInfoField-->
<!--                  :label="$t('dossier.salary')"-->
<!--                  :content="dossierInfo.salary.toLocaleString() + currency"-->
<!--                  bold-->
<!--                />-->

<!--                <DossierDocumentInfoField-->
<!--                  :label="$t('dossier.costs')"-->
<!--                  :content="dossierInfo.costs.toLocaleString() + currency"-->
<!--                />-->

<!--                <DossierDocumentInfoField-->
<!--                  :label="$t('dossier.sustainability')"-->
<!--                  :content="dossierInfo.sustainability + '%'"-->
<!--                  bold-->
<!--                />-->
<!--              </div>-->

<!--              &lt;!&ndash; Right column &ndash;&gt;-->
<!--              <div-->
<!--                class="column col-6"-->
<!--                style="padding-left: 5mm"-->
<!--              >-->
<!--                <DossierDocumentBooleanField-->
<!--                  :value="dossierInfo.buildingRight"-->
<!--                  :label="$t('dossier.building_right')"-->
<!--                />-->

<!--                <DossierDocumentBooleanField-->
<!--                  :value="dossierInfo.debtEnforcements"-->
<!--                  :label="$t('dossier.debt_enforcements')"-->
<!--                />-->

<!--                <DossierDocumentBooleanField-->
<!--                  :value="dossierInfo.lossCertificates"-->
<!--                  :label="$t('dossier.loss_certificates')"-->
<!--                />-->
<!--              </div>-->
<!--            </div>-->



<!--          </q-card>-->

<!--          &lt;!&ndash; Signature line &ndash;&gt;-->
<!--          <div-->
<!--            class="row justify-end"-->
<!--            style="margin-top: 10mm"-->
<!--          >-->
<!--            <div class="column">-->
<!--              <p>-->
<!--                {{ $t('dossier.customer_confirms') }}-->
<!--              </p>-->

<!--              &lt;!&ndash; Signature line &ndash;&gt;-->
<!--              <div-->
<!--                style="border: none; border-bottom: 1px solid black; width: 90mm; margin-top: 12mm"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </q-card>-->

<!--      &lt;!&ndash; Button row &ndash;&gt;-->
<!--      <div-->
<!--        class="row justify-center button-row"-->
<!--        style="margin-bottom: 128px"-->
<!--      >-->
<!--        <q-btn-->
<!--          :label="$t('buttons.back')"-->
<!--          color="primary"-->
<!--          flat-->
<!--          :disable="loading"-->
<!--          @click="goBack"-->
<!--        />-->

<!--        <q-btn-->
<!--          :label="$t('buttons.send_by_email')"-->
<!--          icon="mail_outline"-->
<!--          color="primary"-->
<!--          unelevated-->
<!--          :disable="loading"-->
<!--          style="margin: 0 32px 0 16px"-->
<!--          @click="sendDocument"-->
<!--        />-->

<!--        <q-btn-->
<!--          :label="$t('buttons.print')"-->
<!--          icon="print"-->
<!--          color="primary"-->
<!--          unelevated-->
<!--          :disable="loading"-->
<!--          @click="printDocument"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->
    BNANAO
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

const loading = ref(true)
const fileUuid: Ref<string|null> = ref(null)

// Info for top right-hand corner
const infoString = 'Bahnhofstrasse 1 | 8001 Zürich | 043 222 22 22'
const currency = ' CHF'

//On mount, generate PDF
onMounted(async () => {
  // TODO error if no UUID given

  const dossierQueryResult = await executeQuery(GET_DOSSIER, {uuid: dossierUuid})
  console.log('Data is', dossierQueryResult)

  dossier.value = dossierQueryResult.data.getDossier

  console.log('Dossier is', dossier.value)

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
 * Sends the PDF by e-mail
 * @returns {Promise<void>} - done
 */
function sendDocument(){
  // TODO re-enable
  // const dossierUuid = dossierInfo.uuid
  //
  // const addresses = [
  //   contactInfo.email,
  //   'david.wyss@polygon-software.ch' // TODO get employee's own email address
  // ]
  //
  // $q.dialog({
  //   component: DossierDocumentEmailDialog,
  //   componentProps: {
  //     uuid: dossierUuid,
  //     addresses,
  //     fileUuid: fileUuid.value
  //   }
  // })
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
