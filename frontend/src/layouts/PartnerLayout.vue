<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-4">
    <!-- Menu bar header -->
    <MenuBar/>

    <!-- Side menu -->
    <q-drawer
      v-model="showMenu"
      show-if-above
      side="left"
      width="200"
      bordered
      persistent
    >
      <q-item
        v-for="item in menuItems"
        :key="item.name"
        v-ripple
        clickable
        :label="item.label"
        @click="() => onItemClick(item.route)"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon"/>
        </q-item-section>
        <q-item-section>
          {{item.label}}
        </q-item-section>
      </q-item>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MenuBar from 'src/components/menu/MenuBar.vue'
import {RouterService} from 'src/services/RouterService';

import {inject} from 'vue';
import ROUTES from 'src/router/routes';
import {RouteRecordRaw} from 'vue-router';

const $routerService: RouterService|undefined = inject('$routerService')

const showMenu = true

// Left-side menu items
const menuItems = [
  {
    name: 'home',
    label: 'Home',
    route: ROUTES.LOGIN, // TODO
    icon: 'home'
  },
  {
    name: 'products',
    label: 'Products',
    route: ROUTES.LOGIN, // TODO
    icon: 'local_mall'
  },
  {
    name: 'statistics',
    label: 'Statistics',
    route: ROUTES.LOGIN, // TODO
    icon: 'leaderboard'
  },
  {
    name: 'finances',
    label: 'Finances',
    route: ROUTES.LOGIN, // TODO
    icon: 'paid'
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
