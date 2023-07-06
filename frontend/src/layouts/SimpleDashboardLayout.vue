<template>
  <q-layout class="bg-grey-1" view="hHh lpR fFf">
    <!-- Header with toolbar -->
    <q-header bordered class="q-py-xs bg-primary" height-hint="58">
      <q-toolbar>
        <q-btn
          v-if="$q.screen.gt.xs"
          class="q-ml-xs"
          flat
          dense
          no-caps
          no-wrap
          @click="$routerService?.routeTo(ROUTES.HOME)"
        >
          <q-avatar size="32px">
            <img alt="avatar" src="/icon.svg" />
          </q-avatar>
          <q-toolbar-title class="text-weight-bold" shrink>
            Privetec
          </q-toolbar-title>
        </q-btn>
        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <!-- Language switcher -->
          <LocaleSwitcher />

          <!-- Avatar / account menu -->
          <q-btn flat round @click="accountMenuOpen = !accountMenuOpen">
            <q-avatar size="28px" icon="account_circle" />
            <!-- Dropdown menu -->
            <q-menu>
              <q-list class="column" item-separator link>
                <q-item clickable>
                  <q-item-section @click="goToAccount">
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
      :width="240"
      bordered
      class="drawer-bg"
      show-if-above
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <template v-for="(group, index) in sideMenu" :key="index">
            <q-item-label
              v-if="group.title"
              class="text-weight-bold text-uppercase"
              header
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
                <q-icon :name="link.icon" color="grey" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ link.text }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Page content -->
    <q-page-container>
      <q-pull-to-refresh @refresh="refresh">
        <div :key="key" class="q-px-lg relative-position">
          <router-view />
        </div>
      </q-pull-to-refresh>
    </q-page-container>
  </q-layout>

  <AliasIndicator />
</template>

<script lang="ts" setup>
import { computed, ComputedRef, inject, Ref, ref } from 'vue';

import RouterService from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import AliasIndicator from 'src/flox/modules/alias/components/AliasIndicator.vue';
import { invalidateTables } from 'src/apollo/invalidation';
import LocaleSwitcher from 'components/locale/LocaleSwitcher.vue';
import AuthenticationService from 'src/flox/modules/auth/services/auth.service';
import { i18n } from 'boot/i18n';

import { ALL_TABLES } from '../flox/enum/TABLES';

const $routerService: RouterService | undefined = inject('$routerService');
const leftDrawerOpen: Ref<boolean> = ref(false);
const accountMenuOpen: Ref<boolean> = ref(false);
const key: Ref<number> = ref(0.0);

const $authService: AuthenticationService | undefined = inject('$authService');

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
        text: i18n.global.t('layout.menu.dashboard'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.HOME);
        },
      },
      {
        icon: 'article',
        text: i18n.global.t('layout.menu.articles'),
        click: (): void => {
          void $routerService?.routeTo(ROUTES.ARTICLES);
        },
      },
    ],
  },
]);

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

/**
 * Reroute to account page
 *
 * @async
 */
async function goToAccount(): Promise<void> {
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
    border-color: rgba(0, 0, 0, .24)
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
