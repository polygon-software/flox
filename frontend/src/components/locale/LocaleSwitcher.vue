<template>
  <q-btn round dense flat icon="translate">
    <q-menu>
      <q-list separator padding>
        <q-item
          v-for="locale in localeOptions"
          :key="locale.code"
          :active="i18n.global.locale.value === locale.code"
          clickable
        >
          <q-item-section @click="setLocale(locale.code)">
            <q-item-label>
              {{ locale.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';

import { i18n } from 'boot/i18n';
import { useAuthStore } from 'src/flox/modules/auth/stores/auth.store';
import { updateUser } from 'src/flox/modules/auth/services/user.service';

const $authStore = useAuthStore();

const localeOptions: ComputedRef<{ code: string; label: string }[]> = computed(
  () => {
    return i18n.global.availableLocales.map((code) => ({
      code,
      label: i18n.global.t(`locales.${code}`),
    }));
  }
);

/**
 * Sets a locale according to the provided code
 *
 * @param code - locale code like 'de' or 'en'
 */
async function setLocale(code: string): Promise<void> {
  i18n.global.locale.value = code;
  if ($authStore.loggedIn && $authStore.loggedInUser?.uuid) {
    await updateUser($authStore.loggedInUser.uuid, {
      lang: code,
    });
  }
}
</script>
