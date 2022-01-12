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
import {Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';
import FileUploadField from 'pages/employee/FileUploadField.vue';
import {QFile, useQuasar} from 'quasar';
import DossierDocumentUploadDialog from 'components/dialogs/DossierDocumentUploadDialog.vue';

const $q = useQuasar()

// File Picker component ref
const filePicker: Ref<QFile|null> = ref(null)

// Loading state
const loading = ref(false)

const props = defineProps({
  maxFileSize: {
    type: Number,
    default: 5e7
  }
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
          key: 'id',
        },
        {
          label: i18n.global.t('documents.financials.salary'),
          caption: i18n.global.t('documents.financials.salary_caption'),
          key: 'salary',
        },
        {
          label: 'Rentenbescheinigung',
          caption: 'Der letzten drei Monate',
          key: 'pension',
        },
        {
          label: i18n.global.t('documents.financials.last_year_tax', {year: new Date().getFullYear()-1}),
          caption: i18n.global.t('documents.financials.last_year_tax_caption'),
          key: 'last_year_tax',
        },
        {
          label: i18n.global.t('documents.financials.pension_id'),
          key: 'pension_id',
        },
        {
          label: i18n.global.t('documents.financials.last_year_salary', {year: new Date().getFullYear()-1}),
          key: 'last_year_salary',
        },
      ],
      optional: [
        {
          label: i18n.global.t('documents.financials.debt_collection'),
          key: 'debt_collection',
        },
        {
          label: i18n.global.t('documents.financials.own_funds'),
          caption: i18n.global.t('documents.financials.own_funds_caption'),
          key: 'own_funds',
        },
        {
          label: i18n.global.t('documents.financials.three_a'),
          key: 'three_a',
        },
        {
          label: i18n.global.t('documents.financials.life_insurance'),
          key: 'life_insurance',
        },
        {
          label: i18n.global.t('documents.financials.leasing_contract'),
          key: 'leasing_contract',
        },
        {
          label: i18n.global.t('documents.financials.credit_contract'),
          key: 'credit_contract',
        },
        {
          label: i18n.global.t('documents.financials.work_contract'),
          key: 'work_contract',
        },
        {
          label: i18n.global.t('documents.financials.marriage_contract'),
          key: 'marriage_contract',
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
          key: 'mortgage_contract',
        },
        {
          label: i18n.global.t('documents.property.product_agreement'),
          caption: i18n.global.t('documents.property.mortgage_contract_caption'),
          key: 'product_agreement',
        },
        // TODO CONDITIONAL: EFH only
        {
          label: i18n.global.t('documents.property.building_insurance'),
          caption: i18n.global.t('documents.property.building_insurance_caption'),
          key: 'building_insurance',
        },
        // TODO CONDITIONAL: Stockwerkeigentum Only!
        {
          label: i18n.global.t('documents.property.owner_regulations'),
          caption: i18n.global.t('documents.property.owner_regulations_caption'),
          key: 'owner_regulations',
        },
        // TODO CONDITIONAL: Stockwerkeigentum Only!
        {
          label: i18n.global.t('documents.property.management_regulations'),
          caption: i18n.global.t('documents.property.owner_regulations_caption'),
          key: 'management_regulations',
        },
        {
          label: i18n.global.t('documents.property.floor_plans'),
          key: 'floor_plans',
        },
        {
          label: i18n.global.t('documents.property.pictures'),
          caption: i18n.global.t('documents.property.pictures_caption'),
          key: 'pictures',
        },
        {
          label: i18n.global.t('documents.property.purchase_contract'),
          key: 'purchase_contract',
        },
      ],
      optional: [
        {
          label: i18n.global.t('documents.property.renovations'),
          key: 'renovations',
        },
        {
          label: i18n.global.t('documents.property.legacy_cadaster'),
          caption: i18n.global.t('documents.property.legacy_cadaster_caption'),
          key: 'legacy_cadaster',
        },
        {
          label: i18n.global.t('documents.property.land_register_extract'),
          caption: i18n.global.t('documents.property.land_register_extract_caption'),
          key: 'land_register_extract',
        },
        {
          label: i18n.global.t('documents.property.building_description'),
          caption: i18n.global.t('documents.property.building_description_caption'),
          key: 'building_description',
        },
        {
          label: i18n.global.t('documents.property.reservation_contract'),
          key: 'reservation_contract',
        },
        {
          label: i18n.global.t('documents.property.market_value_estimate'),
          key: 'market_value_estimate',
        },
        {
          label: i18n.global.t('documents.property.sales_documentation'),
          key: 'sales_documentation',
        },
        {
          label: i18n.global.t('documents.property.situation_plan'),
          key: 'situation_plan',
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
            key: 'additional_documents',
          },
        ]
    }
  }
}

// Files for sections
const files: Ref<Record<string, Record<string, unknown>[]>> = ref({})

const uploadFor = ref({
  section: null,
  field: null,
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  filePicker.value.pickFiles()
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

  const section = files.value[sectionKey] as Record<string, File[]>

  // Add field if not present
  if(!section[fieldKey]){
    section[fieldKey] = []
  }
  section[fieldKey] = (section[fieldKey] as File[]).concat(newFiles)
}

/**
 * Removes a file from a given file
 * @param {string} section - section key
 * @param {string} field - field key
 * @param {number} index - file index in array
 * @returns {void}
 */
function removeFile(section: string, field: string, index: number) {
  (files.value[section][field] as File[]).splice(index, 1)
}

/**
 * Determines whether a section is complete
 * @param {string} key - the section's key
 * @returns {boolean} - whether the section is complete
 */
function sectionComplete(key: string): boolean{
  console.log('check for section', key)
  const section = sections[key] as Record<string, unknown>
  const requiredFields = section.fields.required as Record<string, unknown>[]

  const allFiles = files.value

  // Check if all required fields have at least one file
  return requiredFields.every((field) => {
    // Find files for this field (if any)
    const fieldFiles = allFiles[key] && allFiles[key][field.key] ? allFiles[key][field.key] as Record<string, unknown>[] : []

    console.log('field files are', fieldFiles)
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
  // TODO allow only if all required sections complete

  loading.value = true;
  $q.dialog({
    component: DossierDocumentUploadDialog,
    componentProps: {
      files: files
    },
    persistent: true
  }).onOk(() => {
    // TODO
  })
}

/**
 * Upon cancelling, goes back to preceding page
 * @returns {void}
 */
function onCancel(){
  // TODO go back: determine which page to go to
}

</script>
