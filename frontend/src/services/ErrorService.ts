import { QVueGlobals } from 'quasar';

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
      title: `Error: ${error.name}`,
      message: error.message,
      cancel: false,
    });
  }
}
