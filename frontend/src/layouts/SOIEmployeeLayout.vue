<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <!-- Menu bar header -->
    <SOIMenuBar
      @toggle="showDrawer = !showDrawer"
    />

    <!-- Side menu -->
    <q-drawer
      v-model="showDrawer"
      show-if-above
      side="left"
      :width="150"
      persistent
      bordered
      style="padding-top: 20px; display:flex; flex-direction: column"
    >
      <!-- Main items container -->
      <q-item
        v-for="item in menuItems"
        :key="item.name"
        v-ripple
        clickable
        :label="item.label"
        @click="() => onItemClick(item.route)"
      >
          <p
            :class="route.path === item.route.path ? 'text-primary' : 'text-grey-5'"
          >
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
import {inject, ref} from 'vue';
import ROUTES from 'src/router/routes';
import {RouteRecordRaw, useRoute} from 'vue-router';
import {i18n} from 'boot/i18n';
import SOIMenuBar from 'components/menu/SOIMenuBar.vue';
const $routerService: RouterService|undefined = inject('$routerService')
const route = useRoute();

const showDrawer = ref(true)

// Left-side menu items
const menuItems = [
  {
    name: 'applications',
    label: i18n.global.tc('dashboards.dossier', 2),
    route: ROUTES.APPLICATIONS,
  },
]
/**
 * Routes to an item's target route
 * @param {RouteRecordRaw} target - target route
 * @returns {void}
 */
async function onItemClick(target: RouteRecordRaw){
  await $routerService?.routeTo(target)
}
</script>
