<template>
  <strong>{{ $t('conditions') }}</strong>
  <embed
    :src="pdf_link"
    frameborder="0"
    class="q-mt-md"
    style="width: 100%; height: 300px;"
  />
  <q-field
    v-model="accept_conditions"
    lazy-rules="ondemand"
    :rules="[(val) => val === true || $t('must_accepts_conditons')]"
    borderless
    dense
  >
    <template v-slot:control>
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
