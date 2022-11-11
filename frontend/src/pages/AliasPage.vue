<template>
  <div>
    <h4>{{ $t('alias.alias') }}</h4>
    <p>
      {{ $t('alias.description') }}
    </p>
    <p v-if="$authStore.getLoggedInStatus">
      {{ $t('alias.logged_in_as') }} : <b>{{ $authStore.username }}</b>
    </p>
    <p v-if="currentAlias">
      {{ $t('alias.alias_on_user') }}: <b>{{ currentAlias }}.</b>
    </p>
    <q-btn
      v-if="currentAlias"
      unelevated
      class="q-mb-lg"
      color="primary"
      icon-right="visibility_off"
      :label="$t('alias.remove_alias')"
      @click="removeAlias"
    />
    <DataTable
      :title="$t('alias.users')"
      prepend-slot
      :prepend-name="$t('alias.avatar')"
      :columns="userColumns"
      :query="SEARCH_USERS"
      :update-mutation="UPDATE_USER"
      :delete-mutation="DELETE_USER"
    >
      <template #prepend="slotProps">
        <q-td :props="slotProps">
          <q-avatar size="26px">
            <img :src="avatarForUser(slotProps.row.uuid)" alt="Avatar" />
          </q-avatar>
        </q-td>
      </template>
      <template #actions="{ selected }">
        <q-btn
          v-if="selected.length > 0"
          color="primary"
          icon-right="visibility"
          :label="$t('alias.set_alias')"
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
import { i18n } from 'boot/i18n';

const $authStore = useAuthStore();
const currentAlias: Ref<string> = ref('');

const emailRules: ValidationRule[] = [
  joiSchemaToValidationRule(
    Joi.string().email({ tlds: { allow: false } }),
    i18n.global.t('validation.email')
  ),
];

/**
 * Set an alias to the selected user and reload
 * @param users - user to be set as alias
 */
function setAliasTo(users: UserEntity[]): void {
  setAlias(users[0].uuid);
  location.reload();
}

/**
 * Removes alias and reload window
 */
function removeAlias(): void {
  unsetAlias();
  location.reload();
}

onMounted(() => {
  currentAlias.value = getAlias();
});

const userColumns: Ref<ColumnInterface<UserEntity>[]> = ref([
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
