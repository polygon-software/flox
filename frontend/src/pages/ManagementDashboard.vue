<template>
  <q-page
    class="flex flex-center">
    <q-card
      class="square q-pa-md q-ma-md"
      style="width: 800px">

      <p
        class="q-ma-md col text-center"
        style="font-size: x-large"
      >
        {{ $t('chef_dashboard') }}
      </p>
      <q-scroll-area
        style="height: 350px;"
        class="q-ma-md col"
      >
        <q-card
          v-for="employee in employees"
          :key="employee.name"
          class="q-pa-md q-ma-md"
        >
          {{ employee.name }}
        </q-card>
      </q-scroll-area>

      <!-- Register new employee -->

      <div class="flex row justify-center items-center">
        <p class="col-12 text-center q-mb-xs" style="font-size: medium">{{ $t('register_new_employee_here') }}</p>
        <q-btn
          class="col-2 q-mx-md q-mb-md q-mt-xs"
          style="width: 150px"
          :label="$t('signup')"
          color="primary"
          @click="routeToRegisterEmployee"
        />
      </div>

    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {i18n} from 'boot/i18n';
import ROUTES from "src/router/routes";

function routeToRegisterEmployee() {
  await $routerService?.routeTo(ROUTES.NEW_EMPLOYEE_PAGE)
  return;
}

// TODO: replace with real data
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
    name: i18n.global.t('Daniel Gächter'),
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
    name: i18n.global.t('Gioele Monopoli'),
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
