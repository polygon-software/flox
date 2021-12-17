<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <!-- Menu bar header -->
    <AdminMenuBar
      @toggleMenu="toggleMenu"
    />

    <!-- Side menu -->
    <q-drawer
      v-model="showMenu"
      show-if-above
      side="left"
      :width="200"
      persistent
      bordered
      style="padding-top: 20px; display:flex; justify-content: space-between; flex-direction: column"
    >
      <!-- Main items container -->
      <div>
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
      </div>

      <!-- Settings (at bottom of drawer) -->
      <q-item
        v-ripple
        clickable
        label="Settings"
        style="position: absolute; bottom: 0; width: 100%"
        @click="() => onItemClick(ROUTES.SETTINGS)"
      >
        <q-item-section avatar>
          <q-icon name="settings"/>
        </q-item-section>
        <q-item-section>
          Settings
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container
      class="absolute-full"
    >
      <q-scroll-area class="fit">
        <router-view />
      </q-scroll-area>
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import {RouterService} from 'src/services/RouterService';
import {inject, ref} from 'vue';
import ROUTES from 'src/router/routes';
import {RouteRecordRaw} from 'vue-router';
import AdminMenuBar from 'components/menu/AdminMenuBar.vue';

const $routerService: RouterService|undefined = inject('$routerService')

// Whether to show the left-hand menu drawer
const showMenu = ref(true)

// Left-side menu items
const menuItems = [
  {
    name: 'home',
    label: 'Home', // TODO i18n
    route: ROUTES.MAIN,
    icon: 'home'
  },
  {
    name: 'users',
    label: 'Users', // TODO i18n
    route: ROUTES.USERS,
    icon: 'groups'
  },
  {
    name: 'statistics',
    label: 'Statistics', // TODO i18n
    route: ROUTES.MAIN, // TODO
    icon: 'leaderboard'
  },
  {
    name: 'finances',
    label: 'Finances', // TODO i18n
    route: ROUTES.MAIN, // TODO
    icon: 'paid'
  },
]

/**
 * Routes to an item's target route
 * @param {RouteRecordRaw} route - target route
 * @async
 * @returns {void}
 */
async function onItemClick(route: RouteRecordRaw){
  await $routerService?.routeTo(route)
}

/**
 * Toggles the left-hand menu drawer
 * @returns {void}
 */
function toggleMenu(){
  showMenu.value = !showMenu.value
}

</script>
