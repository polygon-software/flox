<template>
  <q-page class="flex flex-center">
    <!-- Active Flox modules -->
    <ModuleStatus/>

    <!-- Form example -->
    <SampleForm/>

    <!-- Private S3File Upload -->
    <FileUpload :accepted-files="'image/*, .pdf' " :query-name="'upload'" :target="'/uploadPrivateFile'"/>

    <!-- Private Files Table -->
    <FilesTable private />
  </q-page>
</template>

<script setup lang="ts">
import ModuleStatus from 'components/sample/ModuleStatus.vue';
import SampleForm from 'components/sample/SampleForm.vue';
import FileUpload from 'src/flox/modules/file/components/forms/fields/FileUpload.vue';
import FilesTable from 'src/flox/modules/file/components/tables/FilesTable.vue';
</script>
