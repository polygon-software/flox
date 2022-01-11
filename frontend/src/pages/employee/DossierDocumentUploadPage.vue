<template>
  <q-page class="flex flex-start">
    <div
      class="column justify-start q-pa-lg full-width"
    >
      <div
        v-for="(section, key) in sections"
        :key="key"
        class="q-ma-none q-pa-none full-width"
      >
        <!-- Title & section status-->
        <div class="row full-width justify-between items-center q-ma-none q-pa-none">
          <h5 class="q-pa-none">
            {{ section.title }}{{ section.required? ' *' : ''}}
          </h5>
          <!-- "Section complete" marker -->
          <div
            v-if="sectionComplete(key)"
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
                  v-for="(file, fileIndex) in field.files"
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

import {ref} from 'vue';

const sections = ref({
  financials: {
    title: 'Finanzdaten', // TODO i18n on all fields!
    required: true,
    fields: [
      {
        label: 'ID / Passkopie',
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
        label: 'Lohnabrechnungen',
        caption: 'Der letzten drei Monate',
        key: 'salary',
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
        label: 'Rentenbescheinigung',
        caption: 'Der letzten drei Monate',
        key: 'pension',
        required: false, // TODO true
        files: []
      },
      {
        label: 'Steuererklärung 2020',
        caption: 'Inkl. Schulden-, Liegenschafts- und Wertschriftenverzeichnis',
        key: 'last_year_tax',
        required: false, // TODO true
        files: []
      },
      {
        label: 'Lohnausweis 2020',
        caption: 'Inkl. Schulden-, Liegenschafts- und Wertschriftenverzeichnis',
        key: 'last_year_salary',
        required: false, // TODO true
        files: []
      }
    ]
  },

  // TODO other sections...
  property: {
    title: 'Liegenschaftsdaten', // TODO i18n on all fields!
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
})


/**
 * Uploads a file for the given section/field
 * @param {string} section - section key
 * @param {string} field - field key
 * @returns {Promise<void>} - done
 */
function uploadFile(section: string, field: string) {

  // TODO add to section
  // sections.value[key].fields[field].push(file)
}

/**
 * Determines whether a section is complete
 * @param {string} key - the section's key
 * @returns {boolean} - whether the section is complete
 */
function sectionComplete(key: string): boolean{
  const section = sections.value[key] as Record<string, unknown>
  const fields = section.fields as Record<string, unknown>[]

  // Check if all required fields have at least one file
  return fields.every((field) => {
    return !field.required || field.files.length > 0
  })
}

</script>
