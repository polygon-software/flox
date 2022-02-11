<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <!-- Menu bar header -->
    <SOIMenuBar
      :admin="true"
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
        <q-btn
          v-if="route.query.cid"
          :label="$t('account_data.employees')"
          no-caps
          flat
          class="text-white"
          style="background: rgba(244, 67, 54, 0.8); border-radius: 0"
          @click="() => onItemClick(ROUTES.MANAGEMENT_EMPLOYEE_DATA, route.query)"
        />
        <q-btn
          v-if="route.query.cid"
          :label="$tc('dashboards.dossier', 2)"
          no-caps
          flat
          class="text-white"
          style="background: rgba(244, 67, 54, 0.8); border-radius: 0"
          @click="() => onItemClick(ROUTES.MANAGEMENT_EMPLOYEE_PROVISIONS, route.query)"
        />
        <router-view :style="computedStyle" />
      </q-scroll-area>
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import {RouterService} from 'src/services/RouterService';
import {computed, inject, ref} from 'vue';
import ROUTES from 'src/router/routes';
import {RouteRecordRaw, useRoute} from 'vue-router';
import {i18n} from 'boot/i18n';
import SOIMenuBar from 'components/menu/SOIMenuBar.vue';
const $routerService: RouterService|undefined = inject('$routerService')
const route = useRoute();

const showDrawer = ref(true)


const computedStyle = computed(() => {
  const isForeignDashboard = route.query.bid || route.query.cid || route.query.eid
  return isForeignDashboard ? 'border: 10px solid rgba(244, 67, 54, 0.8); border-radius: 0 5px 5px 5px' : null
})

// Left-side menu items
const menuItems = [
  {
    name: 'dossiers',
    label: i18n.global.tc('dashboards.dossier', 2),
    route: ROUTES.ADMIN_DOSSIERS,
  },
  {
    name: 'rejected_dossiers',
    label: i18n.global.t('dashboards.rejected_dossiers'),
    route: ROUTES.ADMIN_REJECTED_DOSSIERS,
  },
  {
    name: 'employees',
    label: i18n.global.t('dashboards.soi_employees'),
    route: ROUTES.ADMIN_EMPLOYEES,
  },
  {
    name: 'provision',
    label: i18n.global.tc('account_data.provision', 2),
    route: ROUTES.ADMIN_PROVISION,
  },
  {
    name: 'bank',
    label: i18n.global.tc('account_data.bank', 2),
    route: ROUTES.ADMIN_BANK,
  },
  {
    name: 'files',
    label: i18n.global.t('dashboards.files'),
    route: ROUTES.ADMIN_FILES,
  },
]

/**
 * Routes to an item's target route
 * @param {RouteRecordRaw} target - target route
 * @param {Record<string, unknown>} [query] - query to apply
 * @returns {Promise<void>} - done
 */
async function onItemClick(target: RouteRecordRaw, query?: Record<string, unknown>){
  await $routerService?.routeTo(target, query ?? null)
}
</script>
