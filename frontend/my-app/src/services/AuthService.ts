import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {CognitoAccessToken, CognitoIdToken, CognitoRefreshToken} from "amazon-cognito-auth-js";
import {CognitoUser, CognitoUserSession} from "amazon-cognito-identity-js";
import QrCodeDialog from '../components/dialogs/QrCodeDialog.vue'
import ChangePasswordForm from "../components/forms/ChangePasswordForm.vue"
import ResetPasswordForm from "../components/forms/ResetPasswordForm.vue"
import {ErrorService} from "@/services/ErrorService";
import {ref} from "vue";

/**
 * This is a service that is used globally throughout the application for maintaining authentication state as well as
 * signing up, logging in, logging out, changing passwords, and more.
 */

export class AuthenticationService{

    // AWS User Pool
    userPool: AmazonCognitoIdentity.CognitoUserPool

    // Tokens
    accessToken: CognitoAccessToken|null
    idToken: CognitoIdToken|null
    refreshToken: CognitoRefreshToken|null

    // User
    cognitoUser: AmazonCognitoIdentity.CognitoUser|null
    userSession: CognitoUserSession|null

    // Application info
    appName: String

    // Quasar instance
    $q: any

    // Error handler service
    $errorService: any

    constructor(quasar: any, errorService: ErrorService) {
        // Set up user pool
        const poolSettings = {
            UserPoolId: process.env.VUE_APP_USER_POOL_ID,
            ClientId: process.env.VUE_APP_USER_POOL_CLIENT_ID
        };
        // @ts-ignore
        this.userPool = new AmazonCognitoIdentity.CognitoUserPool(poolSettings)

        // Initialize tokens
        this.accessToken = null
        this.idToken = null
        this.refreshToken = null

        // Set up user & session
        this.cognitoUser = null
        this.userSession = null

        // Quasar & environment variables
        this.$q = quasar
        this.appName = process.env.VUE_APP_NAME ?? 'App'

        // Error service
        this.$errorService = errorService
    }

    /**
     * Checks whether the user is currently logged in
     */
    isLoggedIn(){
        return this.userSession?.isValid() ?? false
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

        // Store in local variable
        this.cognitoUser = cognitoUser

        // Execute auth function
        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result)=>{ this.loginSuccess(result)},
                onFailure: (err)=>{ this.onFailure(err) },
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

                // Called if time-limited one time password is required (only second login or later)
                totpRequired: (tokenType) => {this.verify2FACode(tokenType)},

                //TODO NANI
                mfaRequired: function (codeDeliveryDetails) {
                    const verificationCode = prompt('Please input verification code', '');
                    if (typeof verificationCode === "string") {
                        cognitoUser.sendMFACode(verificationCode, this);
                    }
                },

                // @ts-ignore
                associateSecretCode: (secret) => {this.showQRCodeDialog(secret)}
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
        const cognitoUserWrapper:any = await new Promise((resolve, reject) => {
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

        this.cognitoUser = cognitoUserWrapper.user

        this.showEmailVerificationDialog()
    }

    /**
     * Logs out the currently logged in user (if any)
     */
    logout(){
        this.cognitoUser?.signOut(()=>{
            this.cognitoUser = null;
            this.userSession = null;
        })
    }


    /**
     * Shows a dialog for changing password
     */
    showChangePasswordDialog(){
        this.$q.dialog({
            component: ChangePasswordForm,
            componentProps: {},
        }).onOk(({passwordNew, passwordOld}: {passwordNew: string, passwordOld: string}) => {
            this.cognitoUser?.changePassword(passwordOld,passwordNew, (err, result)=>{
                if(err){
                    this.$errorService.showErrorDialog(err)
                }
            })
        })
    }

    /**
     * Shows a dialog for requesting password reset
     */
    showResetPasswordDialog(){
        this.$q.dialog({
            title: 'Reset Password',
            message: 'Please enter your username',
            cancel: true,
            persistent: true,
            prompt: {
                model: '',
                isValid: (val: string) => val.length >= 1,
                type: 'text'
            },
        }).onOk((input: string) => {
            // Set up cognitoUser first
            this.cognitoUser = new CognitoUser({
                Username: input,
                Pool: this.userPool
            });

            // Call forgotPassword on cognitoUser
            this.cognitoUser.forgotPassword({
                onSuccess: function(result) {
                    console.log('call result: ' + result);
                },
                onFailure: (err) => {this.onFailure(err)},
                inputVerificationCode: () => {this.showResetPasswordFormDialog()}
            });
        })
    }

    /**
     * Show actual password reset form dialog
     */
    showResetPasswordFormDialog(){
        this.$q.dialog({
            component: ResetPasswordForm,
            componentProps: {},
        }).onOk(({passwordNew, verificationCode}: {passwordNew: string, verificationCode: string}) => {
            this.cognitoUser?.confirmPassword(verificationCode,passwordNew,{
                onSuccess: (result)=>{console.log(result)},
                onFailure: (err) => {console.log(err)}
            })
        })

    }

    /**
     * Shows a dialog for verifying E-Mail
     * @param renew {?boolean} - whether to generate a new verification code
     */
    showEmailVerificationDialog(renew = false){
        console.log("verify email dialog")

        if(renew){
            if(!this.cognitoUser){
                this.$errorService.showErrorDialog(new Error("An error occurred, try logging in again"))
                return
            } else {
                console.log("Resend confirmation!")
                this.cognitoUser.resendConfirmationCode(() => {})
            }
        }

        this.$q.dialog({
            title: 'Verification',
            message: 'Please enter your e-mail verification code',
            cancel: true,
            persistent: true,
            prompt: {
                model: '',
                isValid: (val: string) => val.length >= 6,
                type: 'text'
            },
        }).onOk((input: string) => {
            console.log(this.cognitoUser)
            this.verifyEmail(input)
        }).onCancel(() => {
            // TODO
        })
    }

    /**
     * Shows a dialog containing a QR code for setting up two factor authentication
     * @param secretCode {string} - the authenticator code to encode in QR code form
     */
    showQRCodeDialog(secretCode: string){
        const username = this.cognitoUser?.getUsername()
        const codeUrl = `otpauth://totp/${this.appName}:${username}?secret=${secretCode}&Issuer=${this.appName}`
        this.$q.dialog({
            component: QrCodeDialog,
            componentProps: {
                value: codeUrl
            },
        }).onOk(() => {
            // Verify code
            this.$q.dialog({
                title: 'Verification',
                message: 'Please enter your 2FA authenticator code',
                cancel: true,
                persistent: true,
                prompt: {
                    model: '',
                    isValid: (val: string) => val.length >= 6,
                    type: 'text'
                },
            }).onOk((code: string) => {
                // TODO friendlyDeviceName
                this.cognitoUser?.verifySoftwareToken(code, 'My TOTP device', {
                    onSuccess: (userSession)=>{
                        this.loginSuccess(userSession)
                    },
                    onFailure: (error)=>{
                        this.$errorService.showErrorDialog(error)
                    },
                });
            })
        })
    }

    /**
     * Confirm e-mail verification code
     * @param code
     * @param user
     */
    async verifyEmail(code: string,): Promise<void>{
        return new Promise((resolve, reject)=>{
            // @ts-ignore
            this.cognitoUser.confirmRegistration(code, true, (err, result)=>{
                if(err){
                    console.error(err)
                    reject()
                }
                resolve(result)
            })
        })
    }

    /**
     * Verifies a given 2FA code
     * @param tokenType {string} - the type of token to verify
     */
    verify2FACode (tokenType: string) {
        // Verify code
        this.$q.dialog({
            title: 'Verification',
            message: 'Please enter your 2FA authenticator code',
            cancel: true,
            persistent: true,
            prompt: {
                model: '',
                isValid: (val: string) => val.length >= 6,
                type: 'text'
            },
        }).onOk((code: string) => {
            this.cognitoUser?.sendMFACode(code, {
                onSuccess: (userSession: CognitoUserSession)=>{
                    this.loginSuccess(userSession)
                },
                onFailure: (error)=>{
                    this.$errorService.showErrorDialog(error)
                },
            }, tokenType);
        });
    }

    /**
     * When login succeeds
     * @param userSession {CognitoUserSession} - the currently active Cognito user session
     */
    loginSuccess(userSession: CognitoUserSession){
        // Store locally
        this.userSession = userSession;

        // Get & store tokens
        // @ts-ignore
        this.accessToken = userSession.getAccessToken()
        // @ts-ignore
        this.idToken = userSession.getIdToken()
        // @ts-ignore
        this.refreshToken = userSession.getRefreshToken()
    }

    /**
     * When any operation (mostly login) fails, verify whether it is due to the user not having verified their account
     * @param error {Error} - the error that caused the failure
     */
    onFailure(error: Error){
        if(error.name === "UserNotConfirmedException"){
            // Show the e-mail verification dialog and send a new code
            this.showEmailVerificationDialog(true)
        } else {
            this.$errorService.showErrorDialog(error)
        }
    }
}
