<template>
  <q-page class="flex flex-center">
    <!-- Active Flox modules -->
    <ModuleStatus/>

    <!-- DOS own backend -->
    <DosChecker />

    <!-- Form example -->
    <SampleForm/>

    <!-- Private File Upload -->
    <FileUpload :accepted-files="'image/*, .pdf' " target="/uploadPrivateFile"/>

    <!-- Private Files Table -->
    <FilesTable private />

    <!-- Labeled Images -->
    <q-input
      v-model="imageUuid"
      label="Image UUID containing labels"
    />

    <LabeledImage :uuid="imageUuid" :max-width="500" :max-height="500" />

    <DataTable
      title="UserEntity Table"
      :columns="columns"
      :query="QUERY_USERS"
      :update-mutation="UPDATE_USER"
      :delete-mutation="DELETE_USER"
    />
  </q-page>
</template>

<script setup lang="ts">
import {ref, Ref} from 'vue';
import Joi from 'joi';
import {ValidationRule} from 'quasar';

import ModuleStatus from 'components/sample/ModuleStatus.vue';
import SampleForm from 'components/sample/SampleForm.vue';
import FileUpload from 'src/flox/modules/file/components/forms/fields/FileUpload.vue';
import FilesTable from 'src/flox/modules/file/components/tables/FilesTable.vue';
import LabeledImage from 'src/flox/modules/image/components/LabeledImage.vue';
import DataTable from 'components/tables/DataTable.vue';
import DosChecker from 'components/sample/DosChecker.vue';

import { QUERY_USERS } from 'src/flox/modules/auth/user.query';
import {DELETE_USER, UPDATE_USER} from 'src/flox/modules/auth/user.mutation';
import {ColumnInterface} from 'components/tables/useDataTable';
import {UserEntity} from 'src/flox/modules/auth/entities/user.entity';
import { joiSchemaToValidationRule } from 'src/tools/validation.tool';

const imageUuid: Ref<string> = ref('');

const emailRules: ValidationRule[] = [
  joiSchemaToValidationRule(Joi.string().email({ tlds: { allow: false }}), 'validation.email'),
];

const columns: Ref<ColumnInterface<UserEntity>[]> = ref([
  { name: 'uuid', label: 'UUID', field: 'uuid', sortable: true },
  { name: 'username', label: 'Username', field: 'username', sortable: true, edit: true },
  { name: 'email', label: 'E-Mail', field: 'email', sortable: true, edit: true, qInputProps: { rules: emailRules } },
  { name: 'role', label: 'Role', field: 'role', sortable: true },
])
</script>
