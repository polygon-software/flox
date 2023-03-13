<template>
  <div>
    <h4>{{ $t('users.users') }}</h4>
    <div class="col">
      <DataTable
        ref="dataTableRef"
        :columns="columns"
        :delete-mutation="DELETE_USER"
        :entity-type="typeof UserEntity"
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
            :label="$t('general.disable')"
            icon-right="remove_circle"
            no-caps
            no-wrap
            @click="() => disableUsers(selected)"
          ></q-btn>
          <q-btn
            v-if="selected.length > 0"
            :label="$t('general.enable')"
            icon-right="check_circle"
            no-caps
            no-wrap
            @click="() => enableUsers(selected)"
          ></q-btn>
        </template>
        <template #options="{ row }">
          <q-btn
            :label="$t('general.disable')"
            align="right"
            flat
            icon-right="remove_circle"
            no-caps
            no-wrap
            @click="() => disableUsers([row])"
          ></q-btn>
          <q-btn
            :label="$t('general.enable')"
            align="right"
            flat
            icon-right="check_circle"
            no-caps
            no-wrap
            @click="() => enableUsers([row])"
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
import { useQuasar } from 'quasar';

import {
  joiSchemaToValidationRule,
  ValidationRule,
} from 'src/tools/validation.tool';
import { ColumnAlign, ColumnInterface } from 'components/tables/useDataTable';
import DataTable from 'components/tables/DataTable.vue';
import { i18n } from 'boot/i18n';
import AuthenticationService from 'src/flox/modules/auth/services/auth.service';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'src/tools/notification.tool';
import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';

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

const $q = useQuasar();

const emailRules: ValidationRule[] = [
  joiSchemaToValidationRule(
    Joi.string().email({ tlds: { allow: false } }),
    i18n.global.t('validation.email')
  ),
];

const dataTableRef: Ref<InstanceType<typeof DataTable> | null> = ref(null);

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
  {
    name: 'enabled',
    label: i18n.global.t('users.enabled'),
    field: 'enabled',
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
 *
 */
function updateUsersEnabledStatus(users: UserEntity[], value: boolean): void {
  if (dataTableRef.value) {
    users.forEach((user) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      dataTableRef.value?.updateRowLocally(
        user,
        'enabled' as keyof BaseEntity,
        value
      )
    );
  }
}

/**
 * Disable all users in the given list.
 * @returns void
 */
async function disableUsers(users: UserEntity[]): Promise<void> {
  const enabledUsers = users.filter((user) => user.enabled === true);
  await $authService
    ?.disableUsers(enabledUsers)
    .then((responses) => {
      if (responses.every((res) => res.status === 'fulfilled')) {
        showSuccessNotification(
          $q,
          i18n.global.t('authentication.users_disabled')
        );
        updateUsersEnabledStatus(enabledUsers, false);
      } else {
        const fulfilledValues: { uuid: string }[] = [];
        responses.forEach((res) => {
          if (res.status === 'fulfilled' && res.value) {
            fulfilledValues.push(res.value);
            showSuccessNotification(
              $q,
              i18n.global.t('authentication.user_disabled', {
                username: res.value.username,
              })
            );
          } else if (res.status === 'rejected' && res.reason) {
            console.error(res.reason);
            showErrorNotification($q, `${res.reason as string}`);
          }
          updateUsersEnabledStatus(fulfilledValues, false);
        });
      }
    })
    .catch((e) => {
      console.error(e);
      showErrorNotification(
        $q,
        i18n.global.t('authentication.users_disable_failed')
      );
    });
}

/**
 * Enable all users in the given list.
 * @returns void
 */
async function enableUsers(users: UserEntity[]): Promise<void> {
  const disabledUsers = users.filter((user) => user.enabled === false);
  await $authService
    ?.enableUsers(disabledUsers)
    .then((responses) => {
      if (responses.every((res) => res.status === 'fulfilled')) {
        showSuccessNotification(
          $q,
          i18n.global.t('authentication.users_enabled')
        );
        updateUsersEnabledStatus(disabledUsers, true);
      } else {
        const fulfilledValues: { uuid: string }[] = [];
        responses.forEach((res) => {
          if (res.status === 'fulfilled' && res.value) {
            fulfilledValues.push(res.value);
            showSuccessNotification(
              $q,
              i18n.global.t('authentication.user_enabled', {
                username: res.value.username,
              })
            );
          } else if (res.status === 'rejected' && res.reason) {
            console.error(res.reason);
            showErrorNotification($q, `${res.reason as string}`);
          }
        });
        updateUsersEnabledStatus(fulfilledValues, true);
      }
    })
    .catch((e) => {
      console.error(e);
      showErrorNotification(
        $q,
        i18n.global.t('authentication.users_enable_failed')
      );
    });
}
</script>
