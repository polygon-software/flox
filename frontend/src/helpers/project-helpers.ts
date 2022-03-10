import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {i18n} from 'boot/i18n';
import {executeMutation} from 'src/helpers/data-helpers';
import {REMOVE_DEVICE_FROM_PROJECT} from 'src/data/mutations/PROJECT';
import {showNotification} from 'src/helpers/notification-helpers';
import {QVueGlobals} from 'quasar';
import AssignToProjectDialog from 'components/dialogs/AssignToProjectDialog.vue';

/**
 * This file contains all project-related helper functions
 */

/**
 * Shows a dialog for removing a device from a project
 * @param {QVueGlobals} q - quasar instance
 * @param {string} projectUuid - project UUID
 * @param {string} device - device CLI
 * @returns {void}
 */
export function removeDeviceFromProject(q: QVueGlobals, projectUuid: string, device: string){
  q.dialog({
    component: WarningDialog,
    componentProps: {
      description: i18n.global.t('warnings.unassign_device'),
      showDiscard: true,
      discardLabel: i18n.global.t('buttons.cancel'),
      swapNegative: true,
      okLabel: i18n.global.t('buttons.confirm')
    }
  }).onOk(async () => {
    await executeMutation(REMOVE_DEVICE_FROM_PROJECT, {uuid: projectUuid, cli: device})

    // Show success notification
    showNotification(
      q,
      i18n.global.t('messages.removed_device'),
      'bottom',
      'positive',
    )
  })
}

/**
 * Shows a dialog for assigning a device to a project
 * @param {QVueGlobals} q - quasar instance
 * @param {string} device - device CLI
 * @returns {void}
 */
export function assignDeviceToProject(q: QVueGlobals, device: string){
  q.dialog({
    component: AssignToProjectDialog,
    componentProps: {
      cli: device
    }
  }).onOk(() => {
    // Show success notification
    showNotification(
      q,
      i18n.global.t('messages.assigned_device'),
      'bottom',
      'positive',
    )
  })
}
