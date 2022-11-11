<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header class="bg-white text-grey-8 q-py-xs" height-hint="58" bordered>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-btn
          v-if="$q.screen.gt.xs"
          flat
          no-caps
          no-wrap
          class="q-ml-xs"
          @click="$routerService?.routeTo(ROUTES.HOME)"
        >
          <q-avatar size="28px">
            <img src="/icon.svg" />
          </q-avatar>
          <q-toolbar-title shrink class="text-weight-bold">
            Dashboard
          </q-toolbar-title>
        </q-btn>

        <q-space />

        <div class="YL__toolbar-input-container row no-wrap">
          <q-input
            v-model="search"
            dense
            outlined
            rounded
            placeholder="Search"
            class="bg-white col"
          >
            <template #append>
              <q-icon name="search" class="cursor-pointer" color="primary" />
            </template>
          </q-input>
        </div>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            v-if="$q.screen.gt.sm"
            round
            dense
            flat
            color="grey-8"
            icon="apps"
          >
            <q-tooltip>Apps</q-tooltip>
          </q-btn>
          <q-btn
            v-if="$q.screen.gt.sm"
            round
            dense
            flat
            color="grey-8"
            icon="message"
          >
            <q-tooltip>Messages</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating> 2 </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img :src="$authStore.avatar" />
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="drawer-bg"
      :width="240"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <template v-for="(group, index) in sideMenu" :key="index">
            <q-item-label
              v-if="group.title"
              header
              class="text-weight-bold text-uppercase"
            >
              {{ group.title }}
            </q-item-label>

            <q-item
              v-for="link in group.links"
              :key="link.text"
              v-ripple
              clickable
              @click="link.click"
            >
              <q-item-section avatar>
                <q-icon color="grey" :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.text }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator class="q-my-md" />
          </template>

          <q-separator class="q-mt-md q-mb-lg" />

          <template v-for="(group, index) in bottomLinks" :key="index">
            <div class="q-px-md text-grey-9">
              <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
                <a
                  v-for="button in group.links"
                  :key="button.text"
                  class="YL__drawer-footer-link"
                  href="javascript:void(0)"
                  @click="button.click"
                >
                  {{ button.text }}
                </a>
              </div>
            </div>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <div class="q-pa-lg relative-position">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>

  <AliasIndicator />
</template>

<script setup lang="ts">
import { inject, Ref, ref } from 'vue';

import { RouterService } from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import { useAuthStore } from 'src/flox/modules/auth/stores/auth.store';
import AliasIndicator from 'src/flox/modules/alias/components/AliasIndicator.vue';
import { i18n } from 'boot/i18n';

const $routerService: RouterService | undefined = inject('$routerService');
const $authStore = useAuthStore();

const leftDrawerOpen: Ref<boolean> = ref(false);
const search: Ref<string> = ref('');

const sideMenu = [
  {
    title: '',
    links: [
      {
        icon: 'home',
        text: i18n.global.t('menu.home'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.HOME);
        },
      },
      {
        icon: 'group',
        text: i18n.global.t('menu.users'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.USERS);
        },
      },
      {
        icon: 'lock',
        text: i18n.global.t('menu.access_rights'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.ACCESS_CONTROL);
        },
      },
      {
        icon: 'preview',
        text: i18n.global.t('menu.alias'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.ALIAS);
        },
      },
    ],
  },
  {
    links: [
      {
        icon: 'folder',
        text: i18n.global.t('menu.files'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.FILES);
        },
      },
    ],
  },
  {
    links: [
      {
        icon: 'data_object',
        text: i18n.global.t('menu.object_recognition'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.OBJECT_RECOGNITION);
        },
      },
      { icon: 'face', text: i18n.global.t('menu.face_recognition') },
      { icon: 'manage_search', text: i18n.global.t('menu.text_extraction') },
    ],
  },
  {
    links: [
      { icon: 'data_object', text: i18n.global.t('menu.settings') },
      { icon: 'dns', text: i18n.global.t('menu.server_health') },
      { icon: 'mail', text: i18n.global.t('menu.mail') },
      { icon: 'feedback', text: i18n.global.t('menu.feedback') },
    ],
  },
];

const bottomLinks = [
  {
    links: [
      { text: i18n.global.t('footer.developers') },
      { text: i18n.global.t('footer.privacy') },
      { text: i18n.global.t('footer.terms') },
    ],
  },
];
</script>

<style lang="sass">
.drawer-bg
  background-color: $light-dimmed-background

.YL

  &__toolbar-input-container
    min-width: 100px
    width: 55%

  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000
</style>
