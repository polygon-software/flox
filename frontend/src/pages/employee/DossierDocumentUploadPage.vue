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
            v-if="sectionComplete(sectionKey)"
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
              :label="field.label"
              :caption="field.caption"
              :files="filesForField(sectionKey, field.key)"
              required
              @upload="uploadFile(sectionKey, field.key)"
              @remove="(idx) => removeFile(sectionKey, field.key, idx)"
            />
            <q-separator v-if="index < section.fields.required.length-1"/>
          </div>

          <q-separator v-if="section.fields.optional" style="margin-bottom: 10px"/>

          <!-- Optional Fields -->
          <q-expansion-item
            v-if="section.fields.optional"
            :label="$t('documents.optional_documents')"
            header-class="text-grey-7"
            switch-toggle-side
          >
            <div
              v-for="(field, index) in section.fields.optional"
              :key="field.key"
            >
              <FileUploadField
                :label="field.label"
                :caption="field.caption"
                :files="filesForField(sectionKey, field.key)"
                @upload="uploadFile(sectionKey, field.key)"
                @remove="(idx) => removeFile(sectionKey, field.key, idx)"
              />
              <q-separator v-if="index < section.fields.optional.length-1"/>
            </div>
          </q-expansion-item>
        </q-card>
      </div>
    </div>

    <!-- Invisible file picker (does not need a model-value, since upload is handled via event) -->
    <q-file
      v-show="false"
      ref="filePicker"
      :model-value="null"
      multiple
      @update:model-value="onFilePicked"
    />

  </q-page>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';
import FileUploadField from 'pages/employee/FileUploadField.vue';
import {QFile} from 'quasar';

const filePicker: Ref<QFile|null> = ref(null)

const sections = {
  financials: {
    title: i18n.global.t('documents.financials.title'),
    required: true,
    fields: {
      required: [
        {
          label: i18n.global.t('documents.financials.id'),
          key: 'id',
          files: [
            {
              filename: 'blubb.pdf'
            },
            {
              filename: 'blabla.pdf'
            }
          ]
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

  // TODO other sections...
  property: {
    title: i18n.global.t('documents.property.title'),
    required: true,
    fields: {
      required:
      [
        {
          label: 'Kopie Hypothekar-Kreditvertrag',
          caption: 'Bei Ablösungen',
          key: 'id',
          required: true,
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
 * Uploads a file for the given section/field
 * @param {string} section - section key
 * @param {string} field - field key
 * @param {number} index - file index in array
 * @returns {Promise<void>} - done
 */
function removeFile(section: string, field: string, index: number) {
  (files.value[section][field] as File[]).splice(index)
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

</script>
