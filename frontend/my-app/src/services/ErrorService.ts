import {QVueGlobals} from 'quasar';

/**
 * This is a service that is used globally throughout the application for error handling
 */

export class ErrorService {

    // Quasar instance
    $q: QVueGlobals

    constructor(quasar: QVueGlobals) {
        this.$q = quasar
    }

    /**
     * Shows a dialog for the given error
     * @param error {Error} - the error that triggered this dialog
     */
    showErrorDialog(error: Error){
        this.$q.dialog({
            title: 'Error:' + error.name,
            message: error.message,
            cancel: false,
        })
    }
}
