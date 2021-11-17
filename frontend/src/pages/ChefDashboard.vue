<template>
  <q-page
    class="flex flex-center">
    <q-card
      class="square q-pa-md q-ma-md items-center content-center"
      style="width: 800px">

      <p
        class="q-ma-md col text-center"
        style="font-size: large"
      >
        {{ $t('chef_dashboard') }}
      </p>
      <q-scroll-area
        style="height: 400px;"
        class="q-ma-md col"
      >
        <q-card
          class="q-pa-md q-ma-md"
          v-for="employee in employees"
          :key="employee.name"
        >
          {{ employee.name }}
        </q-card>
      </q-scroll-area>


      <!-- Signup Card -->
      <q-card-section
        class="col">
        <div
          class="col"
          v-if="!startSignup"
        >
          <p class="col" style="font-size: medium">Register a new employee here:</p>
          <br>
          <q-btn
            class="q-ma-md"
            style="width: 125px"
            :label="$t('signup')"
            @click="startSignup = true"
            color="primary"
          />
        </div>
        <SignupForm
          @submit="onSignup"
          v-if="startSignup"
        />
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { i18n } from 'boot/i18n';


const startSignup = ref(false)
const employees = ref([
  {
    name: i18n.global.t('Joel Barmettler'),
    model: false,
  },
  {
    name: i18n.global.t('Marius Högger'),
    model: false,
  },
  {
    name: i18n.global.t('Franck Huber'),
    model: false,
  },
  {
    name: i18n.global.t('Daniel Göchter'),
    model: false,
  },
  {
    name: i18n.global.t('David Wyss'),
    model: false,
  },
  {
    name: i18n.global.t('Johann Schwabe'),
    model: false,
  },
  {
    name: i18n.global.t('Thomas Mannhart'),
    model: false,
  },
  {
    name: i18n.global.t('Gioiele Monopoli'),
    model: false,
  },
  {
    name: i18n.global.t('Michèle Fundneider'),
    model: false,
  },
  {
    name: i18n.global.t('Ramize Abdili'),
    model: false,
  },
  {
    name: i18n.global.t('Elexa Heggli'),
    model: false,
  },
  {
    name: i18n.global.t('Marino Schneider'),
    model: false,
  },
  {
    name: i18n.global.t('Magdalena Nguyen'),
    model: false,
  },
  {
    name: i18n.global.t('Carlos Kirchdorfer'),
    model: false,
  },
  {
    name: i18n.global.t('Christoph Fässler'),
    model: false,
  },
])


</script>
