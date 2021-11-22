<template>
  <q-form
    @submit="uploadFiles"
  >
    <!-- Passport or ID -->
    <q-file
      class="q-mb-md"
      outlined
      v-model="passport"
      accept="image/*, .pdf"
      use-chips
      :label="$t('passport_or_id')"
      stack-label
      :rules="[(val) => {val !== null || $t('missing_file')}]"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>

    <!--- Commercial Register Extract -->
    <q-file
      class="q-mb-md"
      outlined
      v-model="commercial_register_extract"
      accept="image/*, .pdf"
      use-chips
      :label="`${$t('commercial_register_extract')} (${$t('optional')})`"
      stack-label
      :rules="[]"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>

    <!-- Execution Register Extract -->
    <q-file
      class="q-mb-md"
      outlined
      v-model="execution_register_extract"
      accept="image/*, .pdf"
      use-chips
      :label="$t('execution_register_extract')"
      stack-label
      :rules="[(val) => {val !== null || $t('missing_file')}]"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>

    <!-- Additional Documents -->
    <q-file
      class="q-mb-md"
      outlined
      v-model="additional_files"
      accept="image/*, .pdf"
      use-chips
      :label="$t('additional_files')"
      stack-label
      multiple
      :rules="[]"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>

    <!-- Confirm Button -->
    <q-btn
      style="width: 125px"
      type="submit"
      :label="$t('submit')"
      color="primary"
    />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const passport = ref()
const commercial_register_extract = ref()
const execution_register_extract = ref()
const additional_files = ref([])

function uploadFiles() {

  //TODO: Commit upload
  console.log('Files uploaded')
}
</script>
