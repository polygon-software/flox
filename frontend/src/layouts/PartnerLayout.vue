<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <!-- Menu bar header -->
    <PartnerMenuBar
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
        style="position: absolute; bottom: 0; width: 100%"
        @click="() => onItemClick(ROUTES.SETTINGS)"
      >
        <q-item-section avatar>
          <q-icon name="settings"/>
        </q-item-section>
        <q-item-section>
          {{ $t('general.settings') }}
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
import PartnerMenuBar from 'components/menu/PartnerMenuBar.vue';
import {i18n} from 'boot/i18n';

const $routerService: RouterService|undefined = inject('$routerService')

// Whether to show the left-hand menu drawer
const showMenu = ref(true)

// Left-side menu items
const menuItems = [
  {
    name: 'home',
    label: i18n.global.t('general.home'),
    route: ROUTES.MAIN,
    icon: 'home'
  },
  {
    name: 'products',
    label: i18n.global.t('products.products'),
    route: ROUTES.MY_PRODUCTS,
    icon: 'local_mall'
  },
  {
    name: 'statistics',
    label: i18n.global.t('dashboards.statistics'),
    route: ROUTES.PARTNER_STATISTICS,
    icon: 'leaderboard'
  },
  {
    name: 'finances',
    label: i18n.global.t('dashboards.finances'),
    route: ROUTES.PARTNER_FINANCES,
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
