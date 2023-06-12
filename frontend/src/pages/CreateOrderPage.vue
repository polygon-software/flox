<template>
  <q-page class="flex flex-center column">
    <div class="q-pa-lg flex-center flex column">
      <h4>
        {{ orderUuid ? $t('pages.edit.title') : $t('pages.create.title') }}
      </h4>
      <div class="row" style="gap: 25px">
        <GenericForm
          v-if="pages.length > 0 && !loading"
          :form-key="formKey"
          :pages="pages"
          preserve-state
          show-cancel
          :loading="loading"
          @submit="submit"
          @cancel="cancel"
        />
        <q-spinner v-if="loading" color="primary" size="3em" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { inject, onMounted, Ref, ref } from 'vue';
import { useQuasar } from 'quasar';
import _ from 'lodash';

import GenericForm from 'src/flox/modules/form/components/GenericForm.vue';
import FormPage from 'src/flox/modules/form/data/types/FormPage';
import FormCard from 'src/flox/modules/form/data/types/FormCard';
import { FIELDS } from 'src/flox/modules/form/data/FIELDS';
import { i18n } from 'boot/i18n';
import formValuesToFormEntityValues, {
  fillFormStoreWithFormEntityValues,
} from 'src/helpers/form-helper';
import FormEntity from 'src/data/form/entities/form.entity';
import {
  createForm,
  getForm,
  updateForm,
} from 'src/data/form/services/form.service';
import ROUTES from 'src/router/routes';
import RouterService from 'src/services/RouterService';
import { useFormStore } from 'src/flox/modules/form/stores/form';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'src/tools/notification.tool';
import {
  buildStoreSubstructure,
  fetchByKey,
} from 'src/flox/modules/form/helpers/form-helpers';
import ImageFileEntity from 'src/data/imageFile/entities/imageFileEntity';

const $routerService: RouterService | undefined = inject('$routerService');
const $q = useQuasar();

const formKey = 'createOrder';
const store = useFormStore();

// Pages of the form with respective cards
const pages: Ref<Array<FormPage>> = ref([]);
// Loading/submitting status
const loading = ref(false);

// get orderUuid from url
const orderUuid = $routerService?.getQueryParam('orderUuid') as string | null;
// the order that can be set with the orderUuid
const order: Ref<FormEntity | null> = ref(null);

// Basic data
const basicData = new FormCard(
  'basicData',
  [
    FIELDS.END_DATE,
    FIELDS.OWNER,
    FIELDS.OBJECT_NUMBER,
    [FIELDS.INTERNAL_ORDER_NUMBER, FIELDS.EXTERNAL_ORDER_NUMBER],
  ],
  i18n.global.t('card_titles.basic_information')
);

// Client data
const clientData = new FormCard(
  'clientData',
  [
    FIELDS.FULL_NAME,
    FIELDS.COMPANY_NAME,
    FIELDS.COMPANY_LEGAL_FORM,
    FIELDS.ADDRESS,
    FIELDS.PHONE_NUMBER,
    FIELDS.EMAIL,
  ],
  i18n.global.t('card_titles.client_information')
);

// Tenant data
const tenantData = new FormCard(
  'tenantData',
  [
    FIELDS.FULL_NAME,
    FIELDS.EXTENDED_ADDRESS,
    FIELDS.PHONE_NUMBER,
    FIELDS.EMAIL,
    FIELDS.FLOOR,
    FIELDS.FLOOR_NUMBER,
  ],
  i18n.global.t('card_titles.tenant_information')
);

// Additional data
const additionalData = new FormCard(
  'additionalData',
  [
    FIELDS.SELECT_POWER_MEASUREMENT,
    FIELDS.PROBLEM_DESCRIPTION,
    FIELDS.PROTOCOL_DATE,
    FIELDS.PROTOCOL,
  ],
  i18n.global.t('card_titles.additional_information')
);

// Billing data
const billingData = new FormCard(
  'billingData',
  [
    FIELDS.COMPANY_NAME,
    FIELDS.FULL_NAME,
    FIELDS.EXTENDED_ADDRESS,
    FIELDS.EMAIL,
  ],
  i18n.global.t('card_titles.billing_data')
);

// Device data
const devices = new FormCard(
  'devices',
  [FIELDS.DEVICES],
  i18n.global.t('card_titles.device_data1')
);

// Device data 2
const deviceData2 = new FormCard(
  'deviceData2',
  [
    [FIELDS.SELECT_DEVICE_TYPE, FIELDS.MANUFACTURER],
    [FIELDS.MODEL, FIELDS.PRODUCTION_NUMBER],
    FIELDS.PRODUCTION_YEAR,
    FIELDS.INFORMATION,
  ],
  i18n.global.t('card_titles.device_data2')
);

// Products and Time recording
const productsAndTimeRecording = new FormCard(
  'productsAndTimeRecording',
  [FIELDS.ARTICLE_NUMBERS, FIELDS.TIME_RECORDINGS],
  i18n.global.t('card_titles.products_and_time_recording')
);

// Final information
const finalInformation = new FormCard(
  'finalInformation',
  [[FIELDS.TOTAL_AMOUNT, FIELDS.EMPLOYEE_ABBREVIATION], FIELDS.FREE_TEXT],
  i18n.global.t('card_titles.final_information')
);

// Job information
const jobInformation = new FormCard(
  'jobInformation',
  [FIELDS.JOB_INFORMATION],
  i18n.global.t('card_titles.job_information')
);

// File upload
const fileUpload = new FormCard(
  'fileUpload',
  [FIELDS.FILE_UPLOAD],
  i18n.global.t('card_titles.file_upload')
);

const oldImages: Ref<ImageFileEntity[] | null> = ref([]);

/**
 * Deletes unneeded GraphQL values on an object and returns its cleaned state
 * @param input - the object
 * @param [keepCreationDate = false] - flag that keeps creation date needed for details table
 * @returns cleaned object
 */
function cleanGraphQLObject(
  input: Record<string, unknown>,
  keepCreationDate?: boolean
): Record<string, unknown> {
  const clone = _.cloneDeep(input);

  delete clone.updatedAt;
  // eslint-disable-next-line no-underscore-dangle
  delete clone.__typename; // __typename is passed by GraphQL

  // Recursively remove values
  Object.keys(clone).forEach((property) => {
    if (typeof clone[property] === 'object' && clone[property] !== null) {
      clone[property] = cleanGraphQLObject(
        clone[property] as Record<string, unknown>
      );
    }
  });

  // Remove general fields
  if (!keepCreationDate) {
    delete clone.createdAt;
  }

  return clone;
}

onMounted(async () => {
  loading.value = true;
  // Empty store state
  store.clearForm(formKey);

  pages.value = [
    // Basic personal data
    new FormPage('formData', i18n.global.t('dossier.form.basicPersonalData'), [
      basicData,
      jobInformation,
      clientData,
      tenantData,
      billingData,
      devices,
      deviceData2,
      additionalData,
      productsAndTimeRecording,
      fileUpload,
      finalInformation,
    ]),
  ];

  // Check if orderUuid is set
  if (orderUuid) {
    // get order by uuid
    const orderResponse = await getForm(orderUuid);
    order.value = cleanGraphQLObject(
      orderResponse as unknown as Record<string, unknown>
    ) as unknown as FormEntity;
    // Build form store structure
    buildStoreSubstructure(formKey, pages.value, true);
    // Set form values
    fillFormStoreWithFormEntityValues(order.value, formKey);

    oldImages.value = (await fetchByKey({
      formKey: 'createOrder',
      pageKey: 'formData',
      cardKey: 'fileUpload',
      fieldKey: FIELDS.FILE_UPLOAD.key,
    })) as ImageFileEntity[] | null;
  }

  loading.value = false;
});

/**
 * On submit, format form field values to createDossierInput values
 */
async function submit(): Promise<void> {
  if (!loading.value) {
    loading.value = true;

    // Form values to dossier values
    const inputValues = formValuesToFormEntityValues(
      formKey,
      orderUuid ?? undefined,
      oldImages.value && oldImages.value.length > 0
        ? oldImages.value
        : undefined
    );

    // Check whether to create or to update the form
    // update
    if (orderUuid) {
      try {
        const res: FormEntity | null = await updateForm(
          inputValues as unknown as Record<string, unknown>
        );
        if (res) {
          showSuccessNotification($q, i18n.global.t('messages.order_updated'), {
            position: 'bottom',
            timeout: 2000,
          });
          await $routerService?.routeTo(ROUTES.HOME);
        } else {
          showErrorNotification($q, i18n.global.t('errors.order_not_updated'), {
            position: 'bottom',
            timeout: 2000,
          });
        }
      } catch (e) {
        showErrorNotification($q, i18n.global.t('errors.order_not_updated'), {
          position: 'bottom',
          timeout: 2000,
        });
      }
    }
    // create
    else {
      try {
        const res: FormEntity | null = await createForm(
          inputValues as unknown as Record<string, unknown>
        );
        if (res) {
          showSuccessNotification($q, i18n.global.t('messages.order_created'), {
            position: 'bottom',
            timeout: 2000,
          });
          await $routerService?.routeTo(ROUTES.HOME);
        } else {
          showErrorNotification($q, i18n.global.t('errors.order_not_created'), {
            position: 'bottom',
            timeout: 2000,
          });
        }
      } catch (e) {
        showErrorNotification($q, i18n.global.t('errors.order_not_created'), {
          position: 'bottom',
          timeout: 2000,
        });
      }
    }
    // Set loading status
    loading.value = false;
  }
}

/**
 * On cancel, redirect to dossier list
 */
async function cancel(): Promise<void> {
  if (!loading.value) {
    loading.value = true;
    store.clearForm(formKey);
    await $routerService?.routeTo(ROUTES.HOME);

    // Set loading status
    loading.value = false;
  }
}
</script>
