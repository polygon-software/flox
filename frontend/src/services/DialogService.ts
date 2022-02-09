import DisableUserDialog from 'components/dialogs/DisableUserDialog.vue';
import {
  DISABLE_USER,
  ENABLE_USER,
  TEMP_DISABLE_USER,
} from 'src/data/mutations/USER';
import { executeMutation } from 'src/helpers/data-helpers';
import { showNotification } from 'src/helpers/notification-helpers';
import { i18n } from 'boot/i18n';
import EnableUserDialog from 'components/dialogs/EnableUserDialog.vue';
import { QVueGlobals } from 'quasar';
import CreateAnnouncementDialog from 'components/dialogs/announcement/CreateAnnouncementDialog.vue';
import UpdateAnnouncementDialog from 'components/dialogs/announcement/UpdateAnnouncementDialog.vue';
import DeleteAnnouncementDialog from 'components/dialogs/announcement/DeleteAnnouncementDialog.vue';
import {
  CREATE_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
} from 'src/data/mutations/ANNOUNCEMENTS';
import { Announcement } from 'src/data/types/Announcement';
import { User } from 'src/data/types/User';
import UserDetailDialog from 'components/dialogs/UserDetailDialog.vue';

/**
 * This is a service that is used globally throughout the application for dialogs
 */
export class DialogService {
  quasar: QVueGlobals;

  /**
   * Constructor
   * @param {QVueGlobals} quasar - $q
   */
  constructor(quasar: QVueGlobals) {
    this.quasar = quasar;
  }

  /**
   * Opens a dialog to disable a given user's account.
   * @param {User} user - user to disable
   * @returns {Promise<void>} - if the user was disabled
   */
  disableUser(user: User): void {
    // Show dialog for choosing disable type (permanent or temporary)
    this.quasar
      .dialog({
        component: DisableUserDialog,
        componentProps: {
          user: user,
        },
      })
      .onOk((until: Date | null) => {
        // Depending on whether an 'until' date is given, disable temporarily or permanently
        const mutation = until ? TEMP_DISABLE_USER : DISABLE_USER;

        const variables: Record<string, unknown> = {
          uuid: user.uuid,
        };

        // Add end date if given
        if (until) {
          variables.until = until;
        }

        // Disable account on backend
        executeMutation(mutation, variables)
          .then(() => {
            // Show confirmation prompt
            showNotification(
              this.quasar,
              i18n.global.t('messages.account_disabled'),
              undefined,
              'negative'
            );
          })
          .catch(() => {
            // Show error prompt
            showNotification(
              this.quasar,
              i18n.global.t('errors.error_while_disabling'),
              undefined,
              'negative'
            );
          });
      });
  }

  /**
   * Opens a dialog for enabling a user's account.
   * @param {User} user - user to enable
   * @returns {Promise<void>} - if the user was enabled
   */
  enableUser(user: User): void {
    // Show info dialog for enabling account
    this.quasar
      .dialog({
        component: EnableUserDialog,
        componentProps: {
          user: user,
        },
      })
      .onOk(() => {
        // Enable account on backend
        executeMutation(ENABLE_USER, {
          uuid: user.uuid,
        })
          .then(() => {
            // Show confirmation prompt
            showNotification(
              this.quasar,
              i18n.global.t('messages.account_enabled'),
              undefined,
              'positive'
            );
          })
          .catch(() => {
            // Show error prompt
            showNotification(
              this.quasar,
              i18n.global.t('errors.error_while_enabling'),
              undefined,
              'negative'
            );
          });
      });
  }

  /**
   * Opens a dialog for creating an announcement.
   * @returns {Promise<void>} - promise
   */
  createAnnouncement(): void {
    // Show info dialog for enabling account
    this.quasar
      .dialog({
        component: CreateAnnouncementDialog,
      })
      .onOk((announcement: Announcement) => {
        // Enable account on backend
        executeMutation(CREATE_ANNOUNCEMENT, {
          createAnnouncementInput: {
            title: announcement.title,
            content: announcement.content,
            userRoles: announcement.userRoles,
            scheduled: announcement.scheduled,
            date: announcement.scheduled ? announcement.date : null,
          },
        })
          .then(() => {
            // Show confirmation prompt
            showNotification(
              this.quasar,
              i18n.global.t('messages.announcement_created'),
              undefined,
              'positive'
            );
          })
          .catch((e) => {
            console.error(e);
            // Show error prompt
            showNotification(
              this.quasar,
              i18n.global.t('errors.error_while_creating_announcement'),
              undefined,
              'negative'
            );
          });
      });
  }

  /**
   * Opens a dialog for updating an announcement.
   * @param {Announcement} originalAnnouncement - announcement to update
   * @returns {Promise<void>} - promise
   */
  updateAnnouncement(originalAnnouncement: Announcement): void {
    // Show info dialog for enabling account
    this.quasar
      .dialog({
        component: UpdateAnnouncementDialog,
        componentProps: {
          originalAnnouncement: originalAnnouncement,
        },
      })
      .onOk((announcement: Announcement) => {
        // Enable account on backend
        executeMutation(UPDATE_ANNOUNCEMENT, {
          updateAnnouncementInput: {
            uuid: announcement.uuid,
            title: announcement.title,
            content: announcement.content,
            userRoles: announcement.userRoles,
            scheduled: announcement.scheduled,
            date: announcement.scheduled ? announcement.date : null,
          },
        })
          .then(() => {
            // Show confirmation prompt
            showNotification(
              this.quasar,
              i18n.global.t('messages.announcement_updated'),
              undefined,
              'positive'
            );
          })
          .catch((e) => {
            console.error(e);
            // Show error prompt
            showNotification(
              this.quasar,
              i18n.global.t('errors.error_while_updating_announcement'),
              undefined,
              'negative'
            );
          });
      });
  }

  /**
   * Opens a dialog for deleting an announcement.
   * @param {Announcement} originalAnnouncement - announcement to delete
   * @returns {Promise<void>} - promise
   */
  deleteAnnouncement(originalAnnouncement: Announcement): void {
    // Show info dialog for enabling account
    this.quasar
      .dialog({
        component: DeleteAnnouncementDialog,
        componentProps: {
          announcement: originalAnnouncement,
        },
      })
      .onOk((announcement: Announcement) => {
        // Enable account on backend
        executeMutation(DELETE_ANNOUNCEMENT, {
          deleteAnnouncementInput: {
            uuid: announcement.uuid,
          },
        })
          .then(() => {
            // Show confirmation prompt
            showNotification(
              this.quasar,
              i18n.global.t('messages.announcement_deleted'),
              undefined,
              'positive'
            );
          })
          .catch((e) => {
            console.error(e);
            // Show error prompt
            showNotification(
              this.quasar,
              i18n.global.t('errors.error_while_deleting_announcement'),
              undefined,
              'negative'
            );
          });
      });
  }

  /**
   * Opens the detailed view of a user in dialog
   * @param {User} user - the selected user
   * @returns {void}
   */
  openDetailUserView(user: User) {
    this.quasar.dialog({
      component: UserDetailDialog,
      componentProps: {
        playerId: user.uuid,
      },
    });
  }
}
