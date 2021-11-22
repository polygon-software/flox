<template>
  <strong>{{ $t('conditions') }}</strong>
  <embed
    :src="pdf_link"
    class="q-mt-md q-pa-md"
    frameBorder="0"
    scrolling="auto"
    height="500px"
    width="100%"
  />
  <q-field
    v-model="accept_conditions"
    lazy-rules="ondemand"
    :rules="[(val) => val === true || $t('must_accepts_conditons')]"
    borderless
    dense
  >
    <template #control>
      <q-checkbox
        v-model="accept_conditions"
        :label="$t('accept_conditions')"
      />
    </template>
  </q-field>

</template>

<script setup lang="ts">
import { ref } from 'vue'

const accept_conditions = ref(false)
const pdf_link = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'

</script>
