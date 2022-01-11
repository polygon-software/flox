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
            <q-item
              class="row"
              style="margin: 20px 0 20px 0"
            >
              <!-- Label & caption -->
              <div class="column">
                <q-item-label>
                  {{ field.label }}
                </q-item-label>
                <q-item-label v-if="field.caption" caption>
                  {{ field.caption }}
                </q-item-label>
              </div>
            </q-item>
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
        files: []
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
