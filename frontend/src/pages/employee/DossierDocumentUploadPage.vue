<template>
  <q-page class="flex flex-start">
    <div
      class="column justify-start q-pa-lg full-width"
    >
      <div
        v-for="(section, sectionKey) in sections"
        :key="sectionKey"
        class="q-ma-none q-pa-none full-width"
      >
        <!-- Title & section status-->
        <div class="row full-width justify-between items-center q-ma-none q-pa-none">
          <h5 class="q-pa-none">
            {{ section.title }}{{ section.required? ' *' : ''}}
          </h5>
          <!-- "Section complete" marker -->
          <div
            v-if="section.required && sectionComplete(sectionKey)"
            class="bg-positive"
            style="height: 24px; width: 24px; border-radius: 12px"
          >
            <q-icon
              color="white"
              name="check"
              size="sm"
            />
          </div>
        </div>

        <!-- Card -->
        <q-card class="full-width q-pa-md">
          <!-- Required Fields -->
          <div
            v-for="(field, index) in section.fields.required"
            :key="field.key"
          >
            <FileUploadField
              :loading="loading"
              :label="field.label"
              :caption="field.caption"
              :files="filesForField(sectionKey, field.key)"
              required
              @upload="uploadFile(sectionKey, field.key)"
              @remove="(idx) => removeFile(sectionKey, field.key, idx)"
            />
            <q-separator v-if="index < section.fields.required.length-1"/>
          </div>

          <q-separator
            v-if="section.fields.optional && section.required"
            style="margin-bottom: 10px"
          />

          <!-- Optional Fields -->
          <q-expansion-item
            v-if="section.fields.optional && section.required"
            :label="$t('documents.optional_documents')"
            header-class="text-grey-7"
            switch-toggle-side
          >
            <div
              v-for="(field, index) in section.fields.optional"
              :key="field.key"
            >
              <FileUploadField
                :loading="loading"
                :label="field.label"
                :caption="field.caption"
                :files="filesForField(sectionKey, field.key)"
                @upload="uploadFile(sectionKey, field.key)"
                @remove="(idx) => removeFile(sectionKey, field.key, idx)"
              />
              <q-separator v-if="index < section.fields.optional.length-1"/>
            </div>
          </q-expansion-item>
          <!-- If entire section is optional, do not show as expansion item -->
          <div
            v-for="(field, index) in section.fields.optional"
            v-else-if="!section.required"
            :key="field.key"
          >
            <FileUploadField
              :loading="loading"
              :label="field.label"
              :caption="field.caption"
              :files="filesForField(sectionKey, field.key)"
              @upload="uploadFile(sectionKey, field.key)"
              @remove="(idx) => removeFile(sectionKey, field.key, idx)"
            />
            <q-separator v-if="index < section.fields.optional.length-1"/>
          </div>

        </q-card>
      </div>
    </div>

    <!-- Invisible file picker (does not need a model-value, since upload is handled via event) -->
    <q-file
      v-show="false"
      ref="filePicker"
      :model-value="null"
      accept=".pdf"
      :max-file-size="props.maxFileSize"
      :max-files="10"
      multiple
      @update:model-value="onFilePicked"
    />

    <!-- Button Row -->
    <div class="row q-ma-none q-pa-none" style="height: 30px; margin-bottom: 64px">
      <q-btn
        class="q-ma-md"
        :label="$t('buttons.cancel')"
        color="primary"
        :disable="loading"
        flat
        @click="onCancel"
      />
      <q-btn
        class="q-ma-md"
        :label="loading ? null : $t('buttons.save')"
        color="primary"
        :disable="loading"
        @click="onSave"
      >
        <q-spinner
          v-if="loading"
          style="margin: 0 24px 0 24px"
        />
      </q-btn>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import {inject, onBeforeMount, Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';
import FileUploadField from 'pages/employee/FileUploadField.vue';
import {QFile, useQuasar} from 'quasar';
import DossierDocumentUploadDialog from 'components/dialogs/DossierDocumentUploadDialog.vue';
import {useRoute} from 'vue-router';
import {DOSSIER_FILE_TYPE} from 'src/data/ENUM/ENUM';
import {executeQuery} from 'src/helpers/data-helpers';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {GET_DOSSIER} from 'src/data/queries/DOSSIER';

const $q = useQuasar()
const route = useRoute()
const $routerService: RouterService|undefined = inject('$routerService')


// Get ID from route
if(!route.query.did){
  throw new Error('Invalid URL')
}

// Files for sections
const files: Ref<Record<string, Record<string,  Array<Record<string, unknown>|File>>>> = ref({
  additional: {},
  financials: {},
  property: {}}
)

const filesToDelete: Ref<Array<string>> = ref([])

const financialsFileTypes = [
  DOSSIER_FILE_TYPE.ID,
  DOSSIER_FILE_TYPE.SALARY,
  DOSSIER_FILE_TYPE.PENSION,
  DOSSIER_FILE_TYPE.LAST_YEAR_TAX,
  DOSSIER_FILE_TYPE.PENSION_ID,
  DOSSIER_FILE_TYPE.LAST_YEAR_SALARY,
  DOSSIER_FILE_TYPE.DEBT_COLLECTION,
  DOSSIER_FILE_TYPE.OWN_FUNDS,
  DOSSIER_FILE_TYPE.THREE_A,
  DOSSIER_FILE_TYPE.LIFE_INSURANCE,
  DOSSIER_FILE_TYPE.LEASING_CONTRACT,
  DOSSIER_FILE_TYPE.CREDIT_CONTRACT,
  DOSSIER_FILE_TYPE.WORK_CONTRACT,
  DOSSIER_FILE_TYPE.MARRIAGE_CONTRACT
]

// UUID of dossier to upload files to
const dossierUuid = route.query.did
const dossier: Ref<Record<string,string|unknown>> = ref({})

onBeforeMount(()=>{
  executeQuery(GET_DOSSIER, {uuid: dossierUuid}).then((queryRes)=>{
    dossier.value = queryRes.data[GET_DOSSIER.cacheLocation] as Record<string,string|unknown>
    const documents = dossier.value.documents as Array<Record<string, string|unknown>>
    documents.forEach((docu)=>{
      const documentType = docu.file_type as DOSSIER_FILE_TYPE
      let subtype = '';

      if(financialsFileTypes.includes(documentType)){
        subtype = 'financials'
      } else if(documentType === `${DOSSIER_FILE_TYPE.ADDITIONAL_DOCUMENTS}`){
        subtype = 'additional'
      } else {
        subtype = 'property'
      }
      if(files.value[subtype][documentType]){
        files.value[subtype][documentType].push(docu)
      } else {
        files.value[subtype][documentType] = [docu]
      }
    })
  }).catch((err)=>{
    console.error(err)
  })
})


// File Picker component ref
const filePicker: Ref<QFile|null> = ref(null)

// Loading state
const loading = ref(false)

const props = defineProps({
  maxFileSize: {
    type: Number,
    default: 5e7
  },
})

// File upload sections
const sections = {
  // Financial documents
  financials: {
    title: i18n.global.t('documents.financials.title'),
    required: true,
    fields: {
      required: [
        {
          label: i18n.global.t('documents.financials.id'),
          key: DOSSIER_FILE_TYPE.ID,
        },
        {
          label: i18n.global.t('documents.financials.salary'),
          caption: i18n.global.t('documents.financials.salary_caption'),
          key: DOSSIER_FILE_TYPE.SALARY,
        },
        {
          label: 'Rentenbescheinigung',
          caption: 'Der letzten drei Monate',
          key: DOSSIER_FILE_TYPE.PENSION,
        },
        {
          label: i18n.global.t('documents.financials.last_year_tax', {year: new Date().getFullYear()-1}),
          caption: i18n.global.t('documents.financials.last_year_tax_caption'),
          key: DOSSIER_FILE_TYPE.LAST_YEAR_TAX,
        },
        {
          label: i18n.global.t('documents.financials.pension_id'),
          key: DOSSIER_FILE_TYPE.PENSION_ID,
        },
        {
          label: i18n.global.t('documents.financials.last_year_salary', {year: new Date().getFullYear()-1}),
          key: DOSSIER_FILE_TYPE.LAST_YEAR_SALARY,
        },
      ],
      optional: [
        {
          label: i18n.global.t('documents.financials.debt_collection'),
          key: DOSSIER_FILE_TYPE.DEBT_COLLECTION,
        },
        {
          label: i18n.global.t('documents.financials.own_funds'),
          caption: i18n.global.t('documents.financials.own_funds_caption'),
          key: DOSSIER_FILE_TYPE.OWN_FUNDS,
        },
        {
          label: i18n.global.t('documents.financials.three_a'),
          key: DOSSIER_FILE_TYPE.THREE_A,
        },
        {
          label: i18n.global.t('documents.financials.life_insurance'),
          key: DOSSIER_FILE_TYPE.LIFE_INSURANCE,
        },
        {
          label: i18n.global.t('documents.financials.leasing_contract'),
          key: DOSSIER_FILE_TYPE.LEASING_CONTRACT,
        },
        {
          label: i18n.global.t('documents.financials.credit_contract'),
          key: DOSSIER_FILE_TYPE.CREDIT_CONTRACT,
        },
        {
          label: i18n.global.t('documents.financials.work_contract'),
          key: DOSSIER_FILE_TYPE.WORK_CONTRACT,
        },
        {
          label: i18n.global.t('documents.financials.marriage_contract'),
          key: DOSSIER_FILE_TYPE.MARRIAGE_CONTRACT,
        }
      ]
    }
  },

  // Property information documents
  property: {
    title: i18n.global.t('documents.property.title'),
    required: true,
    fields: {
      required: [
        {
          label: i18n.global.t('documents.property.mortgage_contract'),
          caption: i18n.global.t('documents.property.mortgage_contract_caption'),
          key: DOSSIER_FILE_TYPE.MORTGAGE_CONTRACT,
        },
        {
          label: i18n.global.t('documents.property.product_agreement'),
          key: DOSSIER_FILE_TYPE.PRODUCT_AGREEMENT,
        },
        // TODO CONDITIONAL: EFH only
        {
          label: i18n.global.t('documents.property.building_insurance'),
          caption: i18n.global.t('documents.property.building_insurance_caption'),
          key: DOSSIER_FILE_TYPE.BUILDING_INSURANCE,
        },
        // TODO CONDITIONAL: Stockwerkeigentum Only!
        {
          label: i18n.global.t('documents.property.owner_regulations'),
          caption: i18n.global.t('documents.property.owner_regulations_caption'),
          key: DOSSIER_FILE_TYPE.OWNER_REGULATIONS,
        },
        // TODO CONDITIONAL: Stockwerkeigentum Only!
        {
          label: i18n.global.t('documents.property.management_regulations'),
          caption: i18n.global.t('documents.property.owner_regulations_caption'),
          key: DOSSIER_FILE_TYPE.MANAGEMENT_REGULATIONS,
        },
        {
          label: i18n.global.t('documents.property.floor_plans'),
          key: DOSSIER_FILE_TYPE.FLOOR_PLANS,
        },
        {
          label: i18n.global.t('documents.property.pictures'),
          caption: i18n.global.t('documents.property.pictures_caption'),
          key: DOSSIER_FILE_TYPE.PICTURES,
        },
        {
          label: i18n.global.t('documents.property.purchase_contract'),
          key: DOSSIER_FILE_TYPE.PURCHASE_CONTRACT,
        },
      ],
      optional: [
        {
          label: i18n.global.t('documents.property.renovations'),
          key: DOSSIER_FILE_TYPE.RENOVATIONS,
        },
        {
          label: i18n.global.t('documents.property.legacy_cadaster'),
          caption: i18n.global.t('documents.property.legacy_cadaster_caption'),
          key: DOSSIER_FILE_TYPE.LEGACY_CADASTER,
        },
        {
          label: i18n.global.t('documents.property.land_register_extract'),
          caption: i18n.global.t('documents.property.land_register_extract_caption'),
          key: DOSSIER_FILE_TYPE.LAND_REGISTER_EXTRACT,
        },
        {
          label: i18n.global.t('documents.property.building_description'),
          caption: i18n.global.t('documents.property.building_description_caption'),
          key: DOSSIER_FILE_TYPE.BUILDING_DESCRIPTION,
        },
        {
          label: i18n.global.t('documents.property.reservation_contract'),
          key: DOSSIER_FILE_TYPE.RESERVATION_CONTRACT,
        },
        {
          label: i18n.global.t('documents.property.market_value_estimate'),
          key: DOSSIER_FILE_TYPE.MARKET_VALUE_ESTIMATE,
        },
        {
          label: i18n.global.t('documents.property.sales_documentation'),
          key: DOSSIER_FILE_TYPE.SALES_DOCUMENTATION,
        },
        {
          label: i18n.global.t('documents.property.situation_plan'),
          key: DOSSIER_FILE_TYPE.SITUATION_PLAN,
        },
      ]
    }
  },
  additional: {
    title: i18n.global.t('documents.additional_documents'),
    required: false,
    fields: {
      required: [],
      optional:
        [
          {
            label: i18n.global.t('documents.additional_documents'),
            key: DOSSIER_FILE_TYPE.ADDITIONAL_DOCUMENTS,
          },
        ]
    }
  }
}

const uploadFor = ref({
  section: '',
  field: '',
})

/**
 * Uploads a file for the given section/field
 * @param {string} section - section key
 * @param {string} field - field key
 * @returns {Promise<void>} - done
 */
function uploadFile(section: string, field: string) {
  // Choose upload target
  uploadFor.value.section = section;
  uploadFor.value.field = field;

  filePicker.value?.pickFiles()
}

/**
 * Triggered when a file is picked from the file picker dialog
 * @param {File[]} newFiles - the newly picked files
 * @returns {void}
 */
function onFilePicked(newFiles: File[]){

  const sectionKey = uploadFor.value.section
  const fieldKey = uploadFor.value.field

  // Add section if not present
  if(!files.value[sectionKey]){
    files.value[sectionKey] = {}
  }

  const section = files.value[sectionKey]

  // Add field if not present
  if(!section[fieldKey]){
    section[fieldKey] = []
  }
  section[fieldKey] = section[fieldKey].concat(newFiles)
}

/**
 * Removes a file from a given field
 * @param {string} section - section key
 * @param {string} field - field key
 * @param {number} index - file index in array
 * @returns {void}
 */
function removeFile(section: string, field: string, index: number) {
  if(files.value[section][field][index].hasOwnProperty('uuid')){
    filesToDelete.value.push((files.value[section][field][index] as Record<string, string|unknown>)['uuid'] as string)
  }
  (files.value[section][field] as unknown[]).splice(index, 1)
}

/**
 * Determines whether a section is complete
 * @param {string} key - the section's key
 * @returns {boolean} - whether the section is complete
 */
function sectionComplete(key: 'financials'|'additional'|'property'): boolean{
  const section = sections[key]
  const requiredFields = section.fields.required

  const allFiles = files.value

  // Check if all required fields have at least one file
  return requiredFields.every((field) => {
    // Find files for this field (if any)
    const fieldFiles = allFiles[key] && allFiles[key][field.key] ? allFiles[key][field.key] as Record<string, unknown>[] : []
    return fieldFiles.length > 0
  })
}

/**
 * Gets the files to pass on to a field
 * @param {string} section - section key
 * @param {string} field - field key
 * @returns {File[]} - the field's files
 */
function filesForField(section: string, field: string): File[]{
  // Section not present, return empty
  if(!files.value[section]){
    return []
  }

  return files.value[section][field] as File[] ?? []
}

/**
 * Saves & uploads all files to the corresponding dossier
 * @returns {Promise<void>} - done
 */
function onSave(){
  loading.value = true;
  $q.dialog({
    component: DossierDocumentUploadDialog,
    componentProps: {
      files: files.value,
      filesToDelete: filesToDelete.value,
      dossierUuid: dossierUuid,
    },
    persistent: true
  }).onOk(() => {
    loading.value = false
    void $routerService?.routeTo(ROUTES.EMPLOYEE_DASHBOARD)
  })
}

/**
 * On cancel, go back to dashboard
 * @returns {Promise<void>} - done
 */
async function onCancel(){
  await $routerService?.routeTo(ROUTES.EMPLOYEE_DASHBOARD)
}

</script>
