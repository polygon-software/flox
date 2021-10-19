import AmazonCognitoIdentity from "amazon-cognito-identity-js";

/**
 * This is a service that is used globally throughout the application for error handling
 */

export class ErrorService {

    // Quasar instance
    $q: any

    constructor(quasar: any) {
        this.$q = quasar
    }

    /**
     * Shows a dialog for the given error
     * @param error {Error} - the error that triggered this dialog
     */
    showErrorDialog(error: Error){
        this.$q.dialog({
            title: "Error:" + error.name,
            message: error.message,
            cancel: false,
        })
    }
}
