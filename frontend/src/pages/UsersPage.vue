<template>
  <div>
    <h4>{{ $t('users.users') }}</h4>
    <div class="col">
      <DataTable
        :title="$t('users.all_users')"
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
              <img :src="avatarForUser(slotProps.row.uuid)" alt="avatar" />
            </q-avatar>
          </q-td>
        </template>
      </DataTable>
      <!-- Create new users -->
      <q-btn
        :class="`${DEFAULT_BUTTON_CLASS} q-my-md`"
        :style="`${DEFAULT_BUTTON_STYLE}; width: 200px`"
        outline
        color="primary"
        :label="$t('buttons.create_user')"
        no-caps
        style="width: 200px"
        @click="createUser"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Joi from 'joi';
import { ref, Ref } from 'vue';

import {
  joiSchemaToValidationRule,
  ValidationRule,
} from 'src/tools/validation.tool';
import { ColumnAlign, ColumnInterface } from 'components/tables/useDataTable';
import UserEntity from 'src/flox/modules/auth/entities/user.entity';
import DataTable from 'components/tables/DataTable.vue';
import { DELETE_USER, UPDATE_USER } from 'src/flox/modules/auth/user.mutation';
import { SEARCH_USERS } from 'src/flox/modules/auth/user.query';
import { avatarForUser } from 'src/flox/modules/auth/services/user.service';
import { i18n } from 'boot/i18n';

import {
  DEFAULT_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
} from '../css/defaultStyles';

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
 * Open the form to create a new user
 * @returns void
 */
function createUser(): void {
  // TODO: open create user form
}
</script>
