<template>
  <q-btn round dense flat color="grey-8" icon="translate">
    <q-menu>
      <q-list separator padding>
        <q-item
          v-for="locale in localeOptions"
          :key="locale.code"
          :active="i18n.global.locale.value === locale.code"
        >
          <q-item-section
            class="cursor-pointer"
            @click="setLocale(locale.code)"
          >
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
import { computed, ComputedRef, onMounted } from 'vue';

import { i18n } from 'boot/i18n';

const localeOptions: ComputedRef<{ code: string; label: string }[]> = computed(
  () => {
    return i18n.global.availableLocales.map((code) => ({
      code,
      label: i18n.global.t(`locales.${code}`),
    }));
  }
);

onMounted(() => {
  console.log('loale', i18n.global.locale.value);
});

/**
 * Sets a locale according to the provided code
 *
 * @param code - locale code like 'de' or 'en'
 */
function setLocale(code: string): void {
  i18n.global.locale.value = code;
}
</script>

<style scoped></style>
