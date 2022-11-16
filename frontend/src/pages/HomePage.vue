<template>
  <h4>{{ $t('pages.home.title') }}</h4>
  <p>{{ desc }}</p>
  <div class="row" style="gap: 25px">
    <ModuleStatus />
    <q-no-ssr>
      <DosChecker />
    </q-no-ssr>
    <SampleForm />
  </div>
</template>
<script setup lang="ts">
import { useMeta } from 'quasar';

import SampleForm from 'components/sample/SampleForm.vue';
import DosChecker from 'components/sample/DosChecker.vue';
import ModuleStatus from 'components/sample/ModuleStatus.vue';
import { i18n } from 'boot/i18n';

const desc: number = 'test';

useMeta({
  title: i18n.global.t('pages.home.meta.title'),
  meta: {
    description: {
      name: 'description',
      content: i18n.global.t('pages.home.meta.description'),
    },
    keywords: {
      name: 'keywords',
      content: i18n.global.t('pages.home.meta.keywords'),
    },
  },
});
</script>
