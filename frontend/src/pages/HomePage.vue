<template>
  <h4>{{ $t('pages.home.title') }}</h4>
  <div class="row" style="gap: 25px">
    <!-- TODO: Dashboard -->
    <h6>Add the dashboard :)</h6>
  </div>
</template>

<script setup lang="ts">
import { useMeta } from 'quasar';

import { i18n } from 'boot/i18n';

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
