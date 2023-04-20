import { QVueGlobals } from 'quasar';

import { i18n } from 'boot/i18n';

/**
 * This is a service that is used globally throughout the application for error handling
 */
export default class ErrorService {
  // Quasar instance
  $q: QVueGlobals;

  /**
   * Constructor
   *
   * @param quasar - quasar instance
   */
  constructor(quasar: QVueGlobals) {
    this.$q = quasar;
  }

  /**
   * Shows a dialog for the given error
   *
   * @param error - the error that triggered this dialog
   */
  showErrorDialog(error: Error): void {
    console.error(error);
    this.$q.dialog({
      title:
        error.name !== 'Error'
          ? `${i18n.global.t('errors.error')}: ${error.name}`
          : i18n.global.t('errors.error'),
      message: error.message,
      cancel: false,
    });
  }
}
