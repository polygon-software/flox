<template>
  <div>
    <h4>{{ $t('users.users') }}</h4>
    <DataTable
      :title="$t('users.users')"
      prepend-slot
      export-selection
      delete-selection
      multi
      :prepend-name="$t('users.avatar')"
      :columns="columns"
      :query="SEARCH_USERS"
      :update-mutation="UPDATE_USER"
      :delete-mutation="DELETE_USER"
    >
      <template #prepend="slotProps">
        <q-td :props="slotProps">
          <q-avatar size="26px">
            <img :src="avatarForUser(slotProps.row.uuid)" />
          </q-avatar>
        </q-td>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import Joi from 'joi';
import { ref, Ref } from 'vue';

import {
  joiSchemaToValidationRule,
  ValidationRule,
} from 'src/tools/validation.tool';
import { ColumnInterface } from 'components/tables/useDataTable';
import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';
import DataTable from 'components/tables/DataTable.vue';
import { DELETE_USER, UPDATE_USER } from 'src/flox/modules/auth/user.mutation';
import { SEARCH_USERS } from 'src/flox/modules/auth/user.query';
import { useAuthStore } from 'src/flox/modules/auth/stores/auth.store';
import { avatarForUser } from 'src/flox/modules/auth/services/user.service';
import { i18n } from 'boot/i18n';

const $authStore = useAuthStore();
const currentAlias: Ref<string> = ref('');

const emailRules: ValidationRule[] = [
  joiSchemaToValidationRule(
    Joi.string().email({ tlds: { allow: false } }),
    'validation.email'
  ),
];

const columns: Ref<ColumnInterface<UserEntity>[]> = ref([
  {
    name: 'username',
    label: i18n.global.t('users.username'),
    field: 'username',
    align: 'left',
    sortable: true,
    edit: true,
  },
  {
    name: 'email',
    label: i18n.global.t('users.email'),
    field: 'email',
    align: 'left',
    sortable: true,
    edit: true,
    qInputProps: { rules: emailRules },
  },
  {
    name: 'role',
    label: i18n.global.t('users.role'),
    field: 'role',
    sortable: true,
  },
]);
</script>

<style scoped></style>