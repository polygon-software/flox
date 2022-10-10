<template>
  <q-page class="flex flex-center">
    <!-- Active Flox modules -->
    <ModuleStatus/>

    <!-- Form example -->
    <SampleForm/>

    <DataTable/>

    <FileUpload :accepted-files="'image/*, .pdf' " :query-name="'upload'" :target="'/uploadPrivateFile'"/>
  </q-page>
</template>

<script setup lang="ts">
import ModuleStatus from 'components/sample/ModuleStatus.vue';
import SampleForm from 'components/sample/SampleForm.vue';
import FileUpload from 'src/flox/modules/file/components/forms/fields/FileUpload.vue';
import DataTable from 'components/tables/DataTable.vue';
import {User} from 'src/data/types/User';
import { QUERY_USERS } from 'src/data/queries/USER';

</script>
