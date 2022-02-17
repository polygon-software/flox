import { QVueGlobals } from 'quasar';
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
