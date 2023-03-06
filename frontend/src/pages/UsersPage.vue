<template>
  <div>
    <h4>{{ $t('users.users') }}</h4>
    <div class="col">
      <DataTable
        :columns="columns"
        :delete-mutation="DELETE_USER"
        :prepend-name="$t('users.avatar')"
        :query="SEARCH_USERS"
        :title="$t('users.all_users')"
        :update-mutation="UPDATE_USER"
        delete-selection
        export-selection
        multi
        options-menu
        prepend-slot
      >
        <template #prepend="slotProps">
          <q-td :props="slotProps">
            <q-avatar size="26px">
              <img :src="avatarForUser(slotProps.row.uuid)" alt="avatar" />
            </q-avatar>
          </q-td>
        </template>
        <template #actions="{ selected }">
          <q-btn
            v-if="selected.length > 0"
            icon-right="no_accounts"
            label="Disable"
            no-caps
            no-wrap
            @click="() => disableUsers(selected)"
          ></q-btn>
        </template>
        <template #options="{ row }">
          <q-btn
            flat
            icon-right="no_accounts"
            label="Disable"
            no-caps
            no-wrap
            @click="() => disableUsers([row])"
          ></q-btn>
        </template>
      </DataTable>
      <!-- Create new users -->
      <q-btn
        :class="`${DEFAULT_BUTTON_CLASS} q-my-md`"
        :label="$t('buttons.create_user')"
        :style="`${DEFAULT_BUTTON_STYLE}; width: 200px`"
        color="primary"
        no-caps
        outline
        style="width: 200px"
        @click="createUser"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Joi from 'joi';
import { inject, ref, Ref } from 'vue';

import {
  joiSchemaToValidationRule,
  ValidationRule,
} from 'src/tools/validation.tool';
import { ColumnAlign, ColumnInterface } from 'components/tables/useDataTable';
import DataTable from 'components/tables/DataTable.vue';
import { i18n } from 'boot/i18n';
import AuthenticationService from 'src/flox/modules/auth/services/auth.service';

import UserEntity from '../flox/modules/auth/entities/user.entity';
import { DELETE_USER, UPDATE_USER } from '../flox/modules/auth/user.mutation';
import { SEARCH_USERS } from '../flox/modules/auth/user.query';
import { avatarForUser } from '../flox/modules/auth/services/user.service';
import {
  DEFAULT_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
} from '../css/defaultStyles';
import RouterService from '../services/RouterService';
import ROUTES from '../router/routes';

const $routerService: RouterService | undefined = inject('$routerService');
const $authService: AuthenticationService | undefined = inject('$authService');

const emailRules: ValidationRule[] = [
  joiSchemaToValidationRule(
    Joi.string().email({ tlds: { allow: false } }),
    i18n.global.t('validation.email')
  ),
];

const columns: Ref<ColumnInterface<UserEntity>[]> = ref([
  {
    name: 'username',
    label: i18n.global.t('users.username'),
    field: 'username',
    align: ColumnAlign.left,
    sortable: true,
    edit: true,
  },
  {
    name: 'email',
    label: i18n.global.t('users.email'),
    field: 'email',
    align: ColumnAlign.left,
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

/**
 * Redirect to the create user page
 * @returns void
 */
async function createUser(): Promise<void> {
  await $routerService?.routeTo(ROUTES.CREATE_USERS);
}

/**
 * Redirect to the create user page
 * @returns void
 */
async function disableUsers(users: UserEntity[]): Promise<void> {
  await $authService?.disableUsers(users);
}
</script>
