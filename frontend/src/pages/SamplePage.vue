<template>
  <q-page class="flex flex-center">
    <!-- Active Flox modules -->
    <ModuleStatus />

    <!-- DOS own backend -->
    <q-no-ssr>
      <DosChecker />
    </q-no-ssr>

    <!-- Form example -->
    <SampleForm />

    <!-- Private Files Table -->

    <AliasIndicator />

    <!-- Labeled Images -->
    <!--    <q-input v-model="imageUuid" label="Image UUID containing labels" />-->

    <!--    <LabeledImage :uuid="imageUuid" :max-width="500" :max-height="500" />-->
  </q-page>
</template>

<script setup lang="ts">
import { useMeta } from 'quasar';
import { Ref, ref } from 'vue';

import { i18n } from 'boot/i18n';
import DosChecker from 'components/sample/DosChecker.vue';
import ModuleStatus from 'components/sample/ModuleStatus.vue';
import SampleForm from 'components/sample/SampleForm.vue';
import AliasIndicator from 'src/flox/modules/alias/components/AliasIndicator.vue';

const imageUuid: Ref<string> = ref('');

useMeta({
  title: i18n.global.t('pages.sample.meta.title'),
  meta: {
    description: {
      name: 'description',
      content: i18n.global.t('pages.sample.meta.description'),
    },
    keywords: {
      name: 'keywords',
      content: i18n.global.t('pages.sample.meta.keywords'),
    },
  },
});
</script>
