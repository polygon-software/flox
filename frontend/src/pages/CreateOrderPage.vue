<template>
  <q-page class="flex flex-center column">
    <q-card class="q-pa-lg flex-center flex column">
      <h4>{{ $t('pages.create.title') }}</h4>
      <GenericForm
        v-if="pages.length > 0"
        :form-key="formKey"
        :pages="pages"
        preserve-state
        :loading="loading"
        @submit="submit"
      />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

import GenericForm from 'src/flox/modules/form/components/GenericForm.vue';
import FormPage from 'src/flox/modules/form/data/types/FormPage';
import FormCard from 'src/flox/modules/form/data/types/FormCard';
import { FIELDS } from 'src/flox/modules/form/data/FIELDS';
import { i18n } from 'boot/i18n';

const formKey = 'createOrder';

// Pages of the form with respective cards
const pages: Ref<Array<FormPage>> = ref([]);
// Loading/submitting status
const loading = ref(false);

// Basic data
const basicData = new FormCard(
  'basicData',
  [
    [FIELDS.END_DATE],
    [FIELDS.OWNER],
    [FIELDS.OBJECT_NUMBER],
    [FIELDS.INTERNAL_ORDER_NUMBER, FIELDS.EXTERNAL_ORDER_NUMBER],
  ],
  i18n.global.t('card_titles.basic_information')
);

// Client data
const clientData = new FormCard(
  'clientData',
  [
    [FIELDS.FULL_NAME],
    [FIELDS.COMPANY_NAME],
    [FIELDS.COMPANY_LEGAL_FORM],
    [FIELDS.ADDRESS],
    [FIELDS.PHONE_NUMBER],
    [FIELDS.EMAIL],
  ],
  i18n.global.t('card_titles.client_information')
);

// Tenant data
const tenantData = new FormCard(
  'tenantData',
  [
    [FIELDS.NAME],
    [FIELDS.EXTENDED_ADDRESS],
    [FIELDS.PHONE_NUMBER],
    [FIELDS.EMAIL],
    [FIELDS.FLOOR],
  ],
  i18n.global.t('card_titles.tenant_information')
);

// Additional data
const additionalData = new FormCard(
  'additionalData',
  [
    [FIELDS.SELECT_POWER_MEASUREMENT],
    [FIELDS.PROBLEM_DESCRIPTION],
    [FIELDS.PROTOCOL_DATE],
    [FIELDS.PROTOCOL],
  ],
  i18n.global.t('card_titles.additional_information')
);

// Billing data
const billingData = new FormCard(
  'billingData',
  [
    [FIELDS.COMPANY_NAME],
    [FIELDS.FULL_NAME],
    [FIELDS.EXTENDED_ADDRESS],
    [FIELDS.EMAIL],
  ],
  i18n.global.t('card_titles.billing_data')
);

// Device data 1
const deviceData1 = new FormCard(
  'deviceData1',
  [
    [FIELDS.SELECT_DEVICE_TYPE, FIELDS.MANUFACTURER],
    [FIELDS.MODEL, FIELDS.PRODUCTION_NUMBER],
    [FIELDS.PRODUCTION_YEAR],
    [FIELDS.INFORMATION],
  ],
  i18n.global.t('card_titles.device_data1')
);

// Device data 2
const deviceData2 = new FormCard(
  'deviceData2',
  [
    [FIELDS.SELECT_DEVICE_TYPE, FIELDS.MANUFACTURER],
    [FIELDS.MODEL, FIELDS.PRODUCTION_NUMBER],
    [FIELDS.PRODUCTION_YEAR],
    [FIELDS.INFORMATION],
  ],
  i18n.global.t('card_titles.device_data2')
);

// Products and Time recording
const productsAndTimeRecording = new FormCard(
  'productsAndTimeRecording',
  [[FIELDS.ARTICLE_NUMBERS], [FIELDS.TIME_RECORDING]],
  i18n.global.t('card_titles.products_and_time_recording')
);

// Final information
const finalInformation = new FormCard(
  'finalInformation',
  [[FIELDS.TOTAL_AMOUNT, FIELDS.EMPLOYEE_ABBREVIATION], [FIELDS.FREE_TEXT]],
  i18n.global.t('card_titles.final_information')
);

// Job information
const jobInformation = new FormCard(
  'jobInformation',
  [[FIELDS.JOB_INFORMATION]],
  i18n.global.t('card_titles.job_information')
);

// File upload
const fileUpload = new FormCard(
  'fileUpload',
  [[FIELDS.FILE_UPLOAD]],
  i18n.global.t('card_titles.file_upload')
);

pages.value = [
  // Basic personal data
  new FormPage(
    'basicPersonalData',
    i18n.global.t('dossier.form.basicPersonalData'),
    [
      basicData,
      jobInformation,
      clientData,
      tenantData,
      billingData,
      deviceData1,
      deviceData2,
      additionalData,
      productsAndTimeRecording,
      fileUpload,
      finalInformation,
    ]
  ),
];

/**
 * On submit, format form field values to createDossierInput values
 * @return {Promise<void>} - done
 */
async function submit(): Promise<void> {
  // TODO actually submit order creation
}
</script>
