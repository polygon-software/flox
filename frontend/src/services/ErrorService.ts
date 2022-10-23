import { QVueGlobals } from 'quasar';

/**
 * This is a service that is used globally throughout the application for error handling
 */
export class ErrorService {
  // Quasar instance
  $q: QVueGlobals;

  /**
   * Constructor
   * @param {QVueGlobals} quasar - quasar instance
   */
  constructor(quasar: QVueGlobals) {
    this.$q = quasar;
  }

  /**
   * Shows a dialog for the given error
   * @param {Error} error - the error that triggered this dialog
   * @returns {void}
   */
  showErrorDialog(error: Error): void {
    console.error(error);
    this.$q.dialog({
      title: 'Error: ' + error.name,
      message: error.message,
      cancel: false,
    });
  }
}
