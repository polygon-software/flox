import DisableUserDialog from 'components/dialogs/DisableUserDialog.vue';
import {DISABLE_USER, ENABLE_USER, TEMP_DISABLE_USER} from 'src/data/mutations/USER';
import {executeMutation} from 'src/helpers/data-helpers';
import {showNotification} from 'src/helpers/notification-helpers';
import {i18n} from 'boot/i18n';
import EnableUserDialog from 'components/dialogs/EnableUserDialog.vue';
import {QVueGlobals} from 'quasar';
import CreateAnnouncementDialog from 'components/dialogs/announcement/CreateAnnouncementDialog.vue';
import UpdateAnnouncementDialog from 'components/dialogs/announcement/UpdateAnnouncementDialog.vue';
import DeleteAnnouncementDialog from 'components/dialogs/announcement/DeleteAnnouncementDialog.vue';
import {CREATE_ANNOUNCEMENT} from 'src/data/queries/ANNOUNCEMENTS';
import {UPDATE_ANNOUNCEMENT} from 'src/data/queries/ANNOUNCEMENTS';
import {DELETE_ANNOUNCEMENT} from 'src/data/queries/ANNOUNCEMENTS';
import {Announcement} from 'src/data/types/Announcement';

/**
 * This file contains all admin helper functions (e.g. for enabling/disabling users)
 */


/**
 * Disables a given user's account
 * @param {Record<string, unknown>} user - the user to disable
 * @param {QVueGlobals} $q - Quasar instance for showing dialogs
 * @returns {Promise<void>} - if the user was disabled
 */
export function disableUser(user: Record<string, unknown>, $q: QVueGlobals): void{
  // Show dialog for choosing disable type (permanent or temporary)
  $q.dialog({
    component: DisableUserDialog,
    componentProps: {
      user: user
    }
  }).onOk((until: Date|null) => {
    // Depending on whether an 'until' date is given, disable temporarily or permanently
    const mutation = until? TEMP_DISABLE_USER : DISABLE_USER

    const variables: Record<string, unknown> = {
      uuid: user.uuid
    }

    // Add end date if given
    if(until){
      variables.until = until
    }

    // Disable account on backend
    executeMutation(
      mutation,
      variables
    ).then(() => {
      // Show confirmation prompt
      showNotification(
        $q,
        i18n.global.t('messages.account_disabled'),
        undefined,
        'negative'
      )
    }).catch(() => {
      // Show error prompt
      showNotification(
        $q,
        i18n.global.t('errors.error_while_disabling'),
        undefined,
        'negative'
      )
    })
  })
}

/**
 * Opens a dialog for enabling a user's account
 * @param {Record<string, unknown>} user - the user to enable
 * @param {QVueGlobals} $q - Quasar instance for showing dialogs
 * @returns {Promise<void>} - if the user was enabled
 */
export function enableUser(user: Record<string, unknown>, $q: QVueGlobals): void{
  // Show info dialog for enabling account
  $q.dialog({
    component: EnableUserDialog,
    componentProps: {
      user: user
    }
  }).onOk(() => {
    // Enable account on backend
    executeMutation(
      ENABLE_USER,
      {
        uuid: user.uuid
      }
    ).then(() => {
      // Show confirmation prompt
      showNotification(
        $q,
        i18n.global.t('messages.account_enabled'),
        undefined,
        'positive'
      )
    }).catch(() => {
      // Show error prompt
      showNotification(
        $q,
        i18n.global.t('errors.error_while_enabling'),
        undefined,
        'negative'
      )
    })
  })
}

/**
 * Opens a dialog for creating an announcement
 * @param {QVueGlobals} $q - Quasar instance for showing dialogs
 * @returns {Promise<void>} - promise
 */
export function createAnnouncement($q: QVueGlobals): void{
  // Show info dialog for enabling account
  $q.dialog({
    component: CreateAnnouncementDialog,
  }).onOk((announcement: Announcement) => {
    // Enable account on backend
    executeMutation(
      CREATE_ANNOUNCEMENT,
      {
        createAnnouncementInput: {
          title: announcement.title,
          content: announcement.content,
          userRole: announcement.userRole,
          date: announcement.date,
          scheduled: announcement.scheduled,
        }
      }
    ).then(() => {
      // Show confirmation prompt
      showNotification(
        $q,
        i18n.global.t('messages.announcement_created'),
        undefined,
        'positive'
      )
    }).catch((e) => {
      console.error(e);
      // Show error prompt
      showNotification(
        $q,
        i18n.global.t('errors.error_while_creating_announcement'),
        undefined,
        'negative'
      )
    })
  })
}

/**
 * Opens a dialog for updating an announcement
 * @param {Announcement} originalAnnouncement - the announcement to update
 * @param {QVueGlobals} $q - Quasar instance for showing dialogs
 * @returns {Promise<void>} - promise
 */
export function updateAnnouncement(originalAnnouncement: Announcement, $q: QVueGlobals): void{
  // Show info dialog for enabling account
  $q.dialog({
    component: UpdateAnnouncementDialog,
    componentProps: {
      originalAnnouncement: originalAnnouncement,
    }
  }).onOk((announcement: Announcement) => {
    // Enable account on backend
    executeMutation(
      UPDATE_ANNOUNCEMENT,
      {
        updateAnnouncementInput: {
          uuid: announcement.uuid,
          title: announcement.title,
          content: announcement.content,
          date: announcement.date,
        }
      }
    ).then(() => {
      // Show confirmation prompt
      showNotification(
        $q,
        i18n.global.t('messages.announcement_updated'),
        undefined,
        'positive'
      )
    }).catch((e) => {
      console.error(e);
      // Show error prompt
      showNotification(
        $q,
        i18n.global.t('errors.error_while_updating_announcement'),
        undefined,
        'negative'
      )
    })
  })
}

/**
 * Opens a dialog for deleting an announcement
 * @param {Announcement} originalAnnouncement - the announcement to delete
 * @param {QVueGlobals} $q - Quasar instance for showing dialogs
 * @returns {Promise<void>} - promise
 */
export function deleteAnnouncement(originalAnnouncement: Announcement, $q: QVueGlobals): void{
  // Show info dialog for enabling account
  $q.dialog({
    component: DeleteAnnouncementDialog,
    componentProps: {
      originalAnnouncement: originalAnnouncement,
    }
  }).onOk((announcement: Announcement) => {
    // Enable account on backend
    executeMutation(
      DELETE_ANNOUNCEMENT,
      {
        deleteAnnouncementInput: {
          uuid: announcement.uuid
        }
      }
    ).then(() => {
      // Show confirmation prompt
      showNotification(
        $q,
        i18n.global.t('messages.announcement_deleted'),
        undefined,
        'positive'
      )
    }).catch((e) => {
      console.error(e);
      // Show error prompt
      showNotification(
        $q,
        i18n.global.t('errors.error_while_deleting_announcement'),
        undefined,
        'negative'
      )
    })
  })
}
