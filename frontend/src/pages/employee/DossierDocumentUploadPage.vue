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
          <!-- Fields -->
          <div
            v-for="(field, index) in section.fields"
            :key="field.key"
          >
            <div
              class="row full-width"
              style="margin: 20px 0 20px 0"
            >
              <!-- Label & caption -->
              <div class="column col-4">
                <q-item-label>
                  {{ field.label }}{{ field.required? ' *' : ''}}
                </q-item-label>
                <q-item-label v-if="field.caption" caption>
                  {{ field.caption }}
                </q-item-label>
              </div>

              <!-- Uploaded files -->
              <div class="column col-6">
                <div
                  v-for="(file, fileIndex) in (files[sectionKey] && files[sectionKey][field.key] ? files[sectionKey][field.key] : [])"
                  :key="'file_' + fileIndex"
                  class="row items-center"
                >
                  <q-icon
                    name="description"
                    color="primary"
                  />
                  <!-- TODO link to file, proper centering -->
                  <p class="text-primary" style="margin-left: 6px">
                    {{file.filename}}
                  </p>

                  <!-- TODO:  @click="() => removeFile(section, field, file)" -->
                  <q-btn
                    class="q-pa-sm q-ma-none"
                    icon="close"
                    flat
                    size="sm"
                    color="grey-5"
                  />
                </div>
              </div>

              <!-- Upload button -->
              <div style="width: 190px; height: 30px">
                <q-btn
                  size="md"
                  :label="$t('buttons.upload')"
                  icon-right="upload"
                  outline
                  color="primary"
                />
              </div>

            </div>
            <q-separator v-if="index < section.fields.length-1"/>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import {Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';

const sections = {
  financials: {
    title: i18n.global.t('documents.financials.title'),
    required: true,
    fields: [
      {
        label: i18n.global.t('documents.financials.id'),
        key: 'id',
        required: true,
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
        required: true,
      },
      {
        label: 'Rentenbescheinigung',
        caption: 'Der letzten drei Monate',
        key: 'pension',
        required: true,
      },
      {
        label: i18n.global.t('documents.financials.last_year_tax', {year: new Date().getFullYear()-1}),
        caption: i18n.global.t('documents.financials.last_year_tax_caption'),
        key: 'last_year_tax',
        required: true,
      },
      {
        label: i18n.global.t('documents.financials.pension_id'),
        key: 'pension_id',
        required: true,
      },
      {
        label: i18n.global.t('documents.financials.last_year_salary', {year: new Date().getFullYear()-1}),
        key: 'last_year_salary',
        required: true,
      },
      {
        label: i18n.global.t('documents.financials.last_year_salary', {year: new Date().getFullYear()-1}),
        key: 'last_year_salary',
        required: true,
      }
    ]
  },

  // TODO other sections...
  property: {
    title: i18n.global.t('documents.property.title'),
    required: true,
    fields: [
      {
        label: 'Kopie Hypothekar-Kreditvertrag',
        caption: 'Bei Ablösungen',
        key: 'id',
        required: true,
        files: []
      },
    ]
  }
}

// Files for sections
const files: Ref<Record<string, Record<string, unknown>[]>> = ref({})


/**
 * Uploads a file for the given section/field
 * @param {string} section - section key
 * @param {string} field - field key
 * @returns {Promise<void>} - done
 */
function uploadFile(section: string, field: string) {

  // TODO add to section
  //
}

/**
 * Determines whether a section is complete
 * @param {string} key - the section's key
 * @returns {boolean} - whether the section is complete
 */
function sectionComplete(key: string): boolean{
  const section = sections[key] as Record<string, unknown>
  const fields = section.fields as Record<string, unknown>[]

  const allFiles = files.value

  // Check if all required fields have at least one file
  return fields.every((field) => {
    const fieldFiles = allFiles[key] && allFiles[key][field] ? allFiles[key][field] as Record<string, unknown>[] : []

    return !field.required || fieldFiles.length > 0
  })
}

</script>
