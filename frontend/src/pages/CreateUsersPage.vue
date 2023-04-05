<template>
  <q-card class="q-pa-md" style="width: 500px">
    <h4>{{ $t('authentication.create_user') }}</h4>
    <CreateUserForm @submit="onSubmit" />
  </q-card>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import { useQuasar } from 'quasar';

import { i18n } from 'boot/i18n';
import CreateUserForm from 'src/flox/modules/auth/components/forms/CreateUserForm.vue';
import SendInvite from 'src/flox/modules/form/data/types/SendInvite';
import GeneratedPasswordDialog from 'src/flox/modules/auth/components/dialogs/GeneratedPasswordDialog.vue';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'src/tools/notification.tool';
import DELIVERY_MEDIUMS from 'src/flox/enum/DELIVERY_MEDIUMS';

import ROLE from '../flox/enum/USER_ROLES';
import { createUserFormKey } from '../flox/modules/form/data/FORM_KEYS';
import { useFormStore } from '../flox/modules/form/stores/form';
import AuthenticationService from '../flox/modules/auth/services/auth.service';
import RouterService from '../services/RouterService';
import ROUTES from '../router/routes';

const $authService: AuthenticationService | undefined = inject('$authService');
const $routerService: RouterService | undefined = inject('$routerService');
const $q = useQuasar();
const store = useFormStore();

/**
 * Upon submit, pass entered values outwards
 * @returns void
 */
async function onSubmit({
  username,
  email,
  locale,
  sendInviteInfo,
  role,
}: {
  username: string;
  email: string;
  locale: string;
  sendInviteInfo: SendInvite;
  role: ROLE;
}): Promise<void> {
  try {
    const result = await $authService?.adminCreateUser(
      username,
      email,
      role,
      (sendInviteInfo.mediums
        ? JSON.parse(sendInviteInfo.mediums)
        : []) as DELIVERY_MEDIUMS[],
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
        }).onOk(() => {});
      }
      // Clear the store and route back to users page
      store.clearForm(createUserFormKey.formKey);
      await $routerService?.routeTo(ROUTES.USERS);
    } else {
      showErrorNotification($q, i18n.global.t('errors.user_creation_failed'));
    }
  } catch (e) {
    showErrorNotification($q, i18n.global.t('errors.account_creation_failed'));
    console.error(e);
  }
}
</script>
