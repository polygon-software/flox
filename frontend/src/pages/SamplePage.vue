<template>
  <q-page class="flex flex-center">
    <!-- Active Flox modules -->
    <ModuleStatus/>

    <!-- Form example -->
    <SampleForm/>

    <DataTable
      title="Users"
      :columns="columns"
    />

    <FileUpload :accepted-files="'image/*, .pdf' " :query-name="'upload'" :target="'/uploadPrivateFile'"/>
  </q-page>
</template>

<script setup lang="ts">
import ModuleStatus from 'components/sample/ModuleStatus.vue';
import SampleForm from 'components/sample/SampleForm.vue';
import FileUpload from 'src/flox/modules/file/components/forms/fields/FileUpload.vue';
import DataTable from 'components/tables/DataTable.vue';
import {User} from 'src/data/types/User';

const columns = [
  { name: 'uuid', label: 'uuid', field: (user: User) => user.uuid, sortable: true },
  { name: 'username', label: 'Username', field: (user: User) => user.username, sortable: true },
  { name: 'email', label: 'E-Mail', field: (user: User) => user.email, sortable: true },
  { name: 'role', label: 'Role', field: (user: User) => user.role, sortable: true },
]
</script>
