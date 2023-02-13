<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <!-- Header with toolbar -->
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
            <img src="/icon.svg" alt="avatar" />
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
          <!-- Language switcher -->
          <LocaleSwitcher />

          <!-- Notifications -->
          <NotificationBell />

          <!-- Avatar / account menu -->
          <q-btn round flat @click="accountMenuOpen = !accountMenuOpen">
            <q-avatar size="26px">
              <img :src="$authStore.avatar" alt="avatar" />
            </q-avatar>
            <!-- Dropdown menu -->
            <q-menu>
              <q-list class="column" item-separator link>
                <q-item clickable>
                  <q-item-section @click="Account">
                    <q-item-label>
                      {{ $t('authentication.account') }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section @click="logout">
                    <q-item-label>
                      {{ $t('authentication.logout') }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Left-side menu drawer -->
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
      <q-pull-to-refresh @refresh="refresh">
        <div :key="key" class="q-pa-lg relative-position">
          <router-view />
        </div>
      </q-pull-to-refresh>
    </q-page-container>
  </q-layout>

  <AliasIndicator />
</template>

<script setup lang="ts">
import { computed, ComputedRef, inject, Ref, ref } from 'vue';

import RouterService from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import { useAuthStore } from 'src/flox/modules/auth/stores/auth.store';
import AliasIndicator from 'src/flox/modules/alias/components/AliasIndicator.vue';
import { i18n } from 'boot/i18n';
import { invalidateTables } from 'src/apollo/invalidation';
import NotificationBell from 'src/flox/modules/notification/components/NotificationBell.vue';
import LocaleSwitcher from 'components/locale/LocaleSwitcher.vue';
import AuthenticationService from 'src/flox/modules/auth/services/auth.service';

import { ALL_TABLES } from '../flox/enum/TABLES';

const $routerService: RouterService | undefined = inject('$routerService');
const $authService: AuthenticationService | undefined = inject('$authService');
const $authStore = useAuthStore();

const leftDrawerOpen: Ref<boolean> = ref(false);
const accountMenuOpen: Ref<boolean> = ref(false);
const search: Ref<string> = ref('');
const key: Ref<number> = ref(0.0);

/**
 * Reloads the entire page and devalidates all queries
 *
 * @param done - callback function to stop loading indication
 */
function refresh(done: () => void): void {
  invalidateTables(ALL_TABLES);
  key.value += 1;
  setTimeout(() => {
    done();
  }, 500);
}

type MenuType = {
  title?: string;
  links: {
    icon: string;
    text: string;
    click?: () => void;
  }[];
};

const sideMenu: ComputedRef<MenuType[]> = computed(() => [
  {
    title: '',
    links: [
      {
        icon: 'home',
        text: i18n.global.t('layout.menu.home'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.HOME);
        },
      },
      {
        icon: 'group',
        text: i18n.global.t('layout.menu.users'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.USERS);
        },
      },
      {
        icon: 'lock',
        text: i18n.global.t('layout.menu.access_rights'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.ACCESS_CONTROL);
        },
      },
      {
        icon: 'preview',
        text: i18n.global.t('layout.menu.alias'),
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
        text: i18n.global.t('layout.menu.files'),
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
        text: i18n.global.t('layout.menu.object_recognition'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.OBJECT_RECOGNITION);
        },
      },
      { icon: 'face', text: i18n.global.t('layout.menu.face_recognition') },
      {
        icon: 'manage_search',
        text: i18n.global.t('layout.menu.text_extraction'),
      },
    ],
  },
  {
    links: [
      {
        icon: 'dns',
        text: i18n.global.t('layout.menu.admin_panel'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.ADMIN_PANEL);
        },
      },
      {
        icon: 'credit_card',
        text: i18n.global.t('layout.menu.payment'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.PAYMENT);
        },
      },
      { icon: 'data_object', text: i18n.global.t('layout.menu.settings') },
    ],
  },
]);

type LinkType = {
  title?: string;
  links: {
    text: string;
    click?: () => void;
  }[];
};
const bottomLinks: ComputedRef<LinkType[]> = computed(() => [
  {
    links: [
      { text: i18n.global.t('layout.footer.developers') },
      { text: i18n.global.t('layout.footer.privacy') },
      { text: i18n.global.t('layout.footer.terms') },
    ],
  },
]);

/**
 * Logs out the user
 *
 * @async
 */
async function Account(): Promise<void> {
  await $routerService?.routeTo(ROUTES.ACCOUNT);
}

/**
 * Logs out the user
 *
 * @async
 */
async function logout(): Promise<void> {
  await $authService?.logout();
  await $routerService?.routeTo(ROUTES.LOGIN);
}
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
