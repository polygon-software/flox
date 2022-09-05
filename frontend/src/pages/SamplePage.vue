<template>
  <q-page class="flex flex-center">
    <!-- Active Flox modules -->
    <ModuleStatus/>

    <!-- Form example -->
    <SampleForm/>

    <FileUpload :query-name="'upload'" :target="'/uploadPrivateFile'"/>
  </q-page>
</template>

<script setup lang="ts">
import ModuleStatus from 'components/sample/ModuleStatus.vue';
import SampleForm from 'components/sample/SampleForm.vue';
import FileUpload from 'src/flox/modules/file/components/forms/fields/FileUpload.vue';
</script>
