import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {CognitoAccessToken, CognitoIdToken, CognitoRefreshToken} from "amazon-cognito-auth-js";
import {CognitoUser} from "amazon-cognito-identity-js";
import {useQuasar} from "quasar";
import QrCodeDialog from '../components/QrCodeDialog.vue'

/**
 * This class is a service that is used for maintaining authentication state as well as signing up, logging in, etc.
 */

export class AuthenticationService{

    // AWS User Pool
    userPool: AmazonCognitoIdentity.CognitoUserPool
    accessToken: CognitoAccessToken|null
    idToken: CognitoIdToken|null
    refreshToken: CognitoRefreshToken|null
    cognitoUser: AmazonCognitoIdentity.CognitoUser|null
    $q: any

    constructor() {
        // Set up user pool
        const poolSettings = {
            UserPoolId: process.env.VUE_APP_USER_POOL_ID,
            ClientId: process.env.VUE_APP_USER_POOL_CLIENT_ID
        };
        this.userPool = new AmazonCognitoIdentity.CognitoUserPool(poolSettings)

        // Initialize tokens
        this.accessToken = null
        this.idToken = null
        this.refreshToken = null
        this.cognitoUser = null
        this.$q = useQuasar()
    }

    /**
     * Logs into the AWS user pool using the given data
     * @param identifier {string} - the user's identifier (usually E-mail or username)
     * @param password {string} - the user's password
     */
    async login(identifier: string, password: string): Promise<void>{

        // Generate auth details
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: identifier,
            Password: password
        });

        // Actual Cognito user on given pool
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: identifier,
            Pool: this.userPool,
        });

        // Execute auth function
        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result)=>{ this.authSuccess(result)},
                onFailure: (err)=>{this.showErrorDialog(err)},
                // Sets up MFA (only done once after signing up)
                mfaSetup: function () {
                    console.log("Set up MFA!")
                    // @ts-ignore
                    cognitoUser.associateSoftwareToken(this)
                },

                // Called in order to select the MFA token type (SOFTWARE_TOKEN_MFA or SMS_TOKEN_MFA)
                selectMFAType: function (challengeName, challengeParameters) {
                    console.log("Select MFA type!", challengeName, challengeParameters)
                    cognitoUser.sendMFASelectionAnswer("SOFTWARE_TOKEN_MFA", this);
                },

                // Called if time-limited one time password is required
                totpRequired: function (tokenType) {
                    console.log(tokenType)
                    // TODO dialog
                    const challengeAnswer = prompt('Please input the TOTP code and random garbage.', '');
                    if (typeof challengeAnswer === "string") {
                        cognitoUser.sendMFACode(challengeAnswer, this, tokenType);
                    }

                },

                mfaRequired: function (codeDeliveryDetails) {
                    const verificationCode = prompt('Please input verification code', '');
                    if (typeof verificationCode === "string") {
                        cognitoUser.sendMFACode(verificationCode, this);
                    }
                },

                // @ts-ignore
                associateSecretCode: (secret) => {this.setup2FA(secret)}
            })
        })
    }

    /**
     * Signs up by creating a new user using the given Username, e-mail and password.
     * TODO make adaptable to other parameters via direct handling of {attributes} param
     * @param username {string} - the chosen username
     * @param email {string} - the user's e-mail address -> TODO move to attributes
     * @param password {string} - the new user's chosen password. Must fulfill the set password conditions
     */
    async signUp(username: string, email: string, password: string) {
        this.cognitoUser = await new Promise((resolve, reject) => {
            const attributes = [];
            attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "email", Value: email}))
            // TODO disable requirement on AWS @thommann
            attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "birthdate", Value: "2000-05-12"}))
            console.log(username, password, attributes)
            //@ts-ignore TODO fix
            this.userPool.signUp(username, password, attributes, [], (err: Error, result: CognitoUser) => {
                if (err) {
                    console.log("blubb", err)
                    reject();
                }
                resolve(result);
            })
        })

    }

    /**
     * TODO
     * @param code
     * @param user
     */
    confirm(code: string,){
        return new Promise((resolve, reject)=>{
            // @ts-ignore
            this.cognitoUser.user.confirmRegistration(code, true, (err, result)=>{
                if(err){
                    console.error(err)
                    reject()
                }
                resolve(result)
            })
        })
    }

    /**
     * TODO
     * @param result {TODO}
     */
    authSuccess(result: any){
        console.log("AUTH success with result", result, typeof result)
        this.accessToken = result.getAccessToken()
        this.idToken = result.getIdToken()
        this.accessToken = result.getRefreshToken()
    }

    setup2FA(secret: string){
        this.showQrCodeDialog(secret);
        //     const challengeAnswer = prompt('Please input the TOTP code.', '');
        //     if (typeof challengeAnswer === "string") {
        //         cognitoUser.verifySoftwareToken(challengeAnswer, 'My TOTP device', this);
        //     }
        // },
    }

    /**
     * TODO helper file
     * @param error
     */
    showErrorDialog(error: Error){
        this.$q.dialog({
            title: "Error:" + error.name,
            message: error.message,
            cancel: false,
        })
    }

    /**
     * TODO helper
     * @param secretCode
     */
    showQrCodeDialog(secretCode: string){
        this.$q.dialog({
            component: QrCodeDialog,
            componentProps: {
                value: secretCode
            },
        }).onOk(() => {
            console.log('OK')
        }).onCancel(() => {
            console.log('Cancel')
        }).onDismiss(() => {
            console.log('Called on OK or Cancel')
        })
    }
}
