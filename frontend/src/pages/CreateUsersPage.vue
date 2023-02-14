<template>
  <q-card class="q-pa-md" style="width: 500px">
    <h4>{{ $t('authentication.create_user') }}</h4>
    <GenericForm
      :pages="CreateUserPages"
      :form-key="createUserFormKey.formKey"
      text-position="center"
      @submit="onSubmit"
    />
  </q-card>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useQuasar } from 'quasar';

import SendInvite from 'src/flox/modules/form/data/types/SendInvite';
import { i18n } from 'boot/i18n';

import COUNTRY_CODES from '../flox/enum/COUNTRIES';
import ROLE from '../flox/enum/USER_ROLES';
import { createUserFormKey } from '../flox/modules/form/data/FORM_KEYS';
import GenericForm from '../flox/modules/form/components/GenericForm.vue';
import CreateUserPages from '../flox/modules/form/data/formPages/CreateUserPages';
import { fetchByKey } from '../flox/modules/form/helpers/form-helpers';
import { FIELDS } from '../flox/modules/form/data/FIELDS';
import { useFormStore } from '../flox/modules/form/stores/form';
import * as auth from '../flox/modules/auth';
import AuthenticationService from '../flox/modules/auth/services/auth.service';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../flox/modules/form/helpers/notification-helpers';
import RouterService from '../services/RouterService';
import ROUTES from '../router/routes';
import GeneratedPasswordDialog from '../flox/modules/auth/components/dialogs/GeneratedPasswordDialog.vue';

const $authService: AuthenticationService | undefined = inject('$authService');
const $routerService: RouterService | undefined = inject('$routerService');
const $q = useQuasar();
const store = useFormStore();

/**
 * Upon submit, pass entered values outwards
 * @returns void
 */
async function onSubmit(): Promise<void> {
  let username;

  const email = fetchByKey({
    ...createUserFormKey,
    fieldKey: FIELDS.EMAIL.key,
  }) as string;

  const sendInviteInfo = fetchByKey({
    ...createUserFormKey,
    fieldKey: FIELDS.SEND_INVITE.key,
  }) as SendInvite;

  const locale = (
    fetchByKey({
      ...createUserFormKey,
      fieldKey: FIELDS.SELECT_LANGUAGE.key,
    }) as COUNTRY_CODES
  ).toLowerCase();

  const role = fetchByKey({
    ...createUserFormKey,
    fieldKey: FIELDS.USER_ROLE.key,
  }) as ROLE;

  if (auth.moduleConfig().emailAsUsername) {
    username = fetchByKey({
      ...createUserFormKey,
      fieldKey: FIELDS.USERNAME.key,
    }) as string;
  }
  try {
    const result = await $authService?.adminCreateUser(
      username ?? email,
      email,
      role,
      sendInviteInfo.mediums ?? [],
      sendInviteInfo.phoneNumber,
      locale
    );

    if (result) {
      showSuccessNotification($q, i18n.global.t('messages.user_created'));
      // No automatic invitation -> display password
      if (sendInviteInfo.mediums?.length === 0) {
        $q.dialog({
          component: GeneratedPasswordDialog,
          componentProps: {
            password: result.password,
          },
        }).onOk(() => {
          void (async (): Promise<void> => {
            await $routerService?.routeTo(ROUTES.USERS);
          })();
        });
      } else {
        // Empty store state
        store.clearForm(createUserFormKey.formKey);
      }
    } else {
      showErrorNotification($q, i18n.global.t('errors.user_creation_failed'));
    }
  } catch (e) {
    console.error(e);
  }
}
</script>
