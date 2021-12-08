<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <!-- Menu bar header -->
    <ManagementMenuBar/>

    <!-- Side menu -->
    <q-drawer
      v-model="showMenu"
      show-if-above
      side="left"
      :width="150"
      persistent
      bordered
      style="padding-top: 20px; display:flex; flex-direction: column"
    >
      <b
        class="text-grey-5 q-pa-md"
      >
        Aktivitäten
      </b>
      <!-- Main items container -->
      <q-item
        v-for="item in menuItems"
        :key="item.name"
        v-ripple
        clickable
        :label="item.label"
        @click="() => onItemClick(item.route)"
      >
          <p class="text-primary">
            {{item.label}}
          </p>
      </q-item>
    </q-drawer>

    <q-page-container class="absolute-full">
      <q-scroll-area class="fit">
        <router-view />
      </q-scroll-area>
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import {RouterService} from 'src/services/RouterService';
import {inject} from 'vue';
import ROUTES from 'src/router/routes';
import {RouteRecordRaw} from 'vue-router';
import {i18n} from 'boot/i18n';
import ManagementMenuBar from 'components/menu/ManagementMenuBar.vue';
const $routerService: RouterService|undefined = inject('$routerService')
const showMenu = true

// Left-side menu items
const menuItems = [
  {
    name: 'employees',
    label: i18n.global.t('account_data.employees'),
    route: ROUTES.LOGIN, // TODO
  },
  { // TODO other options here
    name: 'company',
    label: i18n.global.t('account_data.company'),
    route: ROUTES.LOGIN, // TODO
  },
]
/**
 * Routes to an item's target route
 * @param {RouteRecordRaw} route - target route
 */
async function onItemClick(route: RouteRecordRaw){
  await $routerService?.routeTo(route)
}
</script>
