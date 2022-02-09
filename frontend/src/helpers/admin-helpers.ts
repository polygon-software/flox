import DisableUserDialog from 'components/dialogs/DisableUserDialog.vue';
import {
  DISABLE_USER,
} from 'src/data/mutations/USER';
import { executeMutation } from 'src/helpers/data-helpers';
import { showNotification } from 'src/helpers/notification-helpers';
import { i18n } from 'boot/i18n';
import {QVueGlobals} from 'quasar';
import {ROLE} from 'src/data/ENUM/ENUM';

/**
 * This file contains all admin helper functions (e.g. for enabling/disabling users)
 */

/**
 * Shows a dialog for disabling a given user's account
 * @param {Record<string, unknown>} user - the user to disable
 * @param {ROLE} role - the user's role
 * @param {QVueGlobals} $q - Quasar instance for showing dialogs
 * @returns {Promise<void>} - if the user was disabled
 */
export function disableUser(
  user: Record<string, unknown>,
  role: ROLE,
  $q: QVueGlobals
): void {
  $q.dialog({
    component: DisableUserDialog,
    componentProps: {
      user: user,
    },
  }).onOk(() => {
    // Disable account on backend
    executeMutation(DISABLE_USER, {
      uuid: user.uuid,
      role: role,
    })
      .then(() => {
        // Show confirmation prompt
        showNotification(
          $q,
          i18n.global.t('messages.account_disabled'),
          undefined,
          'negative'
        );
      })
      .catch(() => {
        // Show error prompt
        showNotification(
          $q,
          i18n.global.t('errors.error_while_disabling'),
          undefined,
          'negative'
        );
      });
  });
}

