<template>
  <q-page class="flex flex-center">
      <!-- A4 page container -->
      <q-card class="page">
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
                :label="$t('dossier.created_on')"
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
                :value="dossierInfo.directAmortization"
                :label="$t('dossier.renovated')"
              />

              <DossierDocumentInfoField
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

      </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {formatDate} from 'src/helpers/format-helpers';
import DossierDocumentInfoField from 'components/dossier/DossierDocumentInfoField.vue';
import DossierDocumentBooleanField from 'components/dossier/DossierDocumentBooleanField.vue';

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
</script>

<style scoped>
/* Important: Measurements herein are in mm instead of px/em for printing reasons */
.page {
  width: 210mm;
  min-height: 297mm;
  margin: 10mm auto;
  padding: .5cm 1cm .5cm 1cm;
}

.sub-card{
  padding: 3mm;
  margin-bottom: 3mm
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

/* TODO ensure this is actually needed/use on simple preview page */
@media print {
  html, body {
    width: 210mm;
    height: 297mm;
  }
  .page {
    margin: 0;
    border: initial;
    border-radius: initial;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
  }
}
</style>
