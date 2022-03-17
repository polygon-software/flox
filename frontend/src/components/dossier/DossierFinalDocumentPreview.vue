<template>
  <q-card
    class="page shadow-6"
  >
    <div
      id="preview"
      class="page"
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
                :content="`${dossier.address.street} ${dossier.address.number}`"
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
                :content="dossier.purchase_price.toLocaleString('de-ch') + currency"
              />

              <DossierDocumentInfoField
                :label="$t('dossier.calculated_market_value')"
                :content="dossier.value_estimate_calculated ? dossier.value_estimate_calculated.toLocaleString('de-ch') + currency : $t('dossier.no_prognosis_short')"
              />

              <DossierDocumentInfoField
                :label="$t('dossier.current_mortgage')"
                :content="dossier.mortgage_amount.toLocaleString('de-ch') + currency"
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
                :content="dossier.has_amortisation ? dossier.amortisation_amount.toLocaleString('de-ch') + currency : '-'"
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
              <!-- Partition amount -->
              <DossierDocumentInfoField
                v-for='(amount, index) in dossier.partition_amounts'
                :key="'partition_'+index"
                :label="$t('dossier.installment') + ' ' + (index+1)"
                :content="amount.toLocaleString('de-ch') + currency"
              />

              <!-- Enfeoffment -->
              <DossierDocumentInfoField
                :label="$t('dossier.lending_value')"
                :content="dossier.enfeoffment_estimate_calculated ? dossier.enfeoffment_estimate_calculated + '%': $t('form_for_clients.not_calculable')"
                bold
              />
            </div>
            <div
              class="column col-6"
              style="padding-left: 5mm"
            >
              <!-- Partition expiration date -->
              <DossierDocumentInfoField
                v-for='(date, index) in dossier.partition_dates'
                :key="'partition_'+ index"
                :label="$t('dossier.expiration_date')"
                :content="formatDate(date)"
              />

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

          <!-- Third section: renovation information -->
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
                :content="dossier.renovation_price.toLocaleString('de-ch') + currency"
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
                :content="dossier.eligible_income.toLocaleString('de-ch') + currency"
                bold
              />

              <!-- Total costs -->
              <DossierDocumentInfoField
                :label="$t('dossier.costs')"
                :content="dossier.total_costs ? dossier.total_costs.toLocaleString('de-ch') + currency: $t('form_for_clients.not_calculable')"
              />

              <!-- Affordability -->
              <DossierDocumentInfoField
                :label="$t('dossier.sustainability')"
                :content="dossier.affordability ? dossier.affordability + '%': $t('form_for_clients.not_calculable')"
                bold
              />

              <!-- Assets -->
              <DossierDocumentInfoField
                :label="$t('dossier.assets')"
                :content="dossier.assets.toLocaleString('de-ch') + currency"
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
    </div>
  </q-card>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import DossierDocumentBooleanField from 'components/dossier/DossierDocumentBooleanField.vue';
import DossierDocumentInfoField from 'components/dossier/DossierDocumentInfoField.vue';
import {formatDate} from 'src/helpers/format-helpers';

// Info for top right-hand corner
const infoString = 'Bahnhofstrasse 1 | 8001 Zürich | 043 222 22 22'
const currency = ' CHF'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  dossier: {
    type: Object,
    required: true
  }
})
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
