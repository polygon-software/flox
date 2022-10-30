<template>
  <q-page class="flex flex-center">
    <!-- Active Flox modules -->
    <ModuleStatus />

    <!-- DOS own backend -->
    <q-no-ssr>
      <DosChecker />
    </q-no-ssr>

    <!-- Form example -->
    <SampleForm />

    <!-- Private File Upload -->
    <FileUpload :accepted-files="'image/*, .pdf'" />

    <!-- Private Files Table -->
    <FilesTable private />

    <!-- Labeled Images -->
<!--    <q-input v-model="imageUuid" label="Image UUID containing labels" />-->

<!--    <LabeledImage :uuid="imageUuid" :max-width="500" :max-height="500" />-->

<!--    <DataTable-->
<!--      title="User Table"-->
<!--      :columns="columns"-->
<!--      :query="SEARCH_USERS"-->
<!--      :update-mutation="UPDATE_USER"-->
<!--      :delete-mutation="DELETE_USER"-->
<!--    />-->
  </q-page>
</template>

<script setup lang="ts">
import Joi from 'joi';
import { useMeta } from 'quasar';
import { Ref, ref } from 'vue';

import { i18n } from 'boot/i18n';
import DosChecker from 'components/sample/DosChecker.vue';
import ModuleStatus from 'components/sample/ModuleStatus.vue';
import SampleForm from 'components/sample/SampleForm.vue';
import DataTable from 'components/tables/DataTable.vue';
import { ColumnInterface } from 'components/tables/useDataTable';
import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';
import { DELETE_USER, UPDATE_USER } from 'src/flox/modules/auth/user.mutation';
import { SEARCH_USERS } from 'src/flox/modules/auth/user.query';
import FileUpload from 'src/flox/modules/file/components/forms/fields/FileUpload.vue';
import FilesTable from 'src/flox/modules/file/components/tables/FilesTable.vue';
import LabeledImage from 'src/flox/modules/image/components/LabeledImage.vue';
import {
  joiSchemaToValidationRule,
  ValidationRule,
} from 'src/tools/validation.tool';

const imageUuid: Ref<string> = ref('');

const emailRules: ValidationRule[] = [
  joiSchemaToValidationRule(
    Joi.string().email({ tlds: { allow: false } }),
    'validation.email'
  ),
];

const columns: Ref<ColumnInterface<UserEntity>[]> = ref([
  { name: 'uuid', label: 'UUID', field: 'uuid', sortable: true },
  {
    name: 'username',
    label: 'Username',
    field: 'username',
    sortable: true,
    edit: true,
  },
  {
    name: 'email',
    label: 'E-Mail',
    field: 'email',
    sortable: true,
    edit: true,
    qInputProps: { rules: emailRules },
  },
  {
    name: 'role',
    label: 'Role',
    field: 'role',
    sortable: true,
  },
]);

useMeta({
  title: i18n.global.t('pages.sample.meta.title'),
  meta: {
    description: {
      name: 'description',
      content: i18n.global.t('pages.sample.meta.description'),
    },
    keywords: {
      name: 'keywords',
      content: i18n.global.t('pages.sample.meta.keywords'),
    },
  },
});
</script>
