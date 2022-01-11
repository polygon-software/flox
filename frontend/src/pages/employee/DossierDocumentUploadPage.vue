<template>
  <q-page class="flex flex-start">
    <div
      class="column q-pa-lg full-width"
    >
      <div
        v-for="section in sections"
        :key="section.key"
      >
        <!-- Title -->
        <h5>
          {{ section.title }}{{ section.required? ' *' : ''}}
        </h5>

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
                  {{ field.label }}
                </q-item-label>
                <q-item-label v-if="field.caption" caption>
                  {{ field.caption }}
                </q-item-label>
              </div>

              <!-- Uploaded files -->
              <div class="column col-6">
                <div
                  v-for="(file, index) in field.files"
                  :key="'file_' + index"
                  class="row"
                >
                  <q-icon
                    name="description"
                    color="primary"
                  />
                  <!-- TODO link to file... -->
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

const sections = ref([
  {
    title: 'Finanzdaten', // TODO i18n on all fields!
    key: 'financials',
    required: true,
    fields: [
      {
        label: 'ID / Passkopie',
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
        label: 'Lohnabrechnungen',
        caption: 'Der letzten drei Monate',
        key: 'salary',
        files: []
      },
      {
        label: 'Rentenbescheinigung',
        caption: 'Der letzten drei Monate',
        key: 'pension',
        files: []
      },
      {
        label: 'Steuererklärung 2020',
        caption: 'Inkl. Schulden-, Liegenschafts- und Wertschriftenverzeichnis',
        key: 'last_year_tax',
        files: []
      },
      {
        label: 'Lohnausweis 2020',
        caption: 'Inkl. Schulden-, Liegenschafts- und Wertschriftenverzeichnis',
        key: 'last_year_salary',
        files: []
      }
    ]
  },

  // TODO other sections...
  {
    title: 'Liegenschaftsdaten', // TODO i18n on all fields!
    key: 'property',
    required: true,
    fields: [
      {
        label: 'Kopie Hypothekar-Kreditvertrag',
        caption: 'Bei Ablösungen',
        key: 'id',
        files: []
      },
    ]
  }
])

</script>
