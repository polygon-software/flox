<template>
  <q-page class="flex flex-center">
    <!-- Active Flox modules -->
    <ModuleStatus/>

    <!-- Form example -->
    <SampleForm/>

    <!-- Private File Upload -->
    <FileUpload :accepted-files="'image/*, .pdf' " :query-name="'upload'" :target="'/uploadPrivateFile'"/>

    <!-- Private Files Table -->
    <FilesTable private />

    <!-- Labeled Images -->
    <q-input
      v-model="imageUuid"
      label="Image UUID containing labels"
    />
    <LabeledImage :uuid="imageUuid" :max-width="500" :max-height="500" />
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {Ref} from '@vue/reactivity';

import ModuleStatus from 'components/sample/ModuleStatus.vue';
import SampleForm from 'components/sample/SampleForm.vue';
import FileUpload from 'src/flox/modules/file/components/forms/fields/FileUpload.vue';
import FilesTable from 'src/flox/modules/file/components/tables/FilesTable.vue';
import LabeledImage from 'src/flox/modules/image/components/LabeledImage.vue';

const imageUuid: Ref<string> = ref('');
</script>
