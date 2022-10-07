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

    <!-- Labeled Images -->
    <LabeledImage uuid="7f4391dd-4906-4c76-9ec2-44ebe22abafc" :max-width="500" :max-height="500" />
  </q-page>
</template>

<script setup lang="ts">
import ModuleStatus from 'components/sample/ModuleStatus.vue';
import SampleForm from 'components/sample/SampleForm.vue';
import FileUpload from 'src/flox/modules/file/components/forms/fields/FileUpload.vue';
import FilesTable from 'src/flox/modules/file/components/tables/FilesTable.vue';
import LabeledImage from 'src/flox/modules/image/components/LabeledImage.vue';</script>
