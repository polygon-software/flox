<template>
  <div>
    <h4>Alias</h4>
    <p>
      This module can be used to see and use the application as if you were
      another user. This functionality is only available for admin accounts.
    </p>
    <p v-if="$authStore.getLoggedInStatus">
      You are currently logged in as: <b>{{ $authStore.username }}</b>
    </p>
    <p v-if="currentAlias">
      You are currently browsing with an active alias for the user with ID
      <b>{{ currentAlias }}.</b>
    </p>
    <q-btn
      v-if="currentAlias"
      unelevated
      class="q-mb-lg"
      color="primary"
      icon-right="visibility_off"
      label="Remove Alias"
      @click="removeAlias"
    />
    <DataTable
      title="User Table"
      prepend-slot
      prepend-name="Avatar"
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
      <template #actions="{ selected }">
        <q-btn
          v-if="selected.length > 0"
          color="primary"
          icon-right="visibility"
          label="Set Alias"
          no-caps
          @click="setAliasTo(selected)"
        />
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import Joi from 'joi';
import { onMounted, ref, Ref } from 'vue';

import {
  joiSchemaToValidationRule,
  ValidationRule,
} from 'src/tools/validation.tool';
import { ColumnInterface } from 'components/tables/useDataTable';
import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';
import DataTable from 'components/tables/DataTable.vue';
import { DELETE_USER, UPDATE_USER } from 'src/flox/modules/auth/user.mutation';
import { SEARCH_USERS } from 'src/flox/modules/auth/user.query';
import {
  getAlias,
  setAlias,
  unsetAlias,
} from 'src/flox/modules/alias/services/alias.service';
import { useAuthStore } from 'src/flox/modules/auth/stores/auth.store';
import { avatarForUser } from 'src/flox/modules/auth/services/user.service';

const $authStore = useAuthStore();
const currentAlias: Ref<string> = ref('');

const emailRules: ValidationRule[] = [
  joiSchemaToValidationRule(
    Joi.string().email({ tlds: { allow: false } }),
    'validation.email'
  ),
];

function setAliasTo(users: UserEntity[]): void {
  setAlias(users[0].uuid);
  location.reload();
}

function removeAlias(): void {
  unsetAlias();
  location.reload();
}

onMounted(() => {
  currentAlias.value = getAlias();
});

const columns: Ref<ColumnInterface<UserEntity>[]> = ref([
  {
    name: 'username',
    label: 'Username',
    field: 'username',
    align: 'left',
    sortable: true,
    edit: true,
  },
  {
    name: 'email',
    label: 'E-Mail',
    field: 'email',
    align: 'left',
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
</script>

<style scoped></style>
