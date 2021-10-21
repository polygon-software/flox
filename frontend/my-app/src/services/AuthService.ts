import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {CognitoAccessToken, CognitoIdToken, CognitoRefreshToken} from 'amazon-cognito-auth-js';
import {CognitoUser, CognitoUserSession, ICognitoUserPoolData, ISignUpResult} from 'amazon-cognito-identity-js';
import QrCodeDialog from '../components/dialogs/QrCodeDialog.vue'
import ChangePasswordForm from '../components/forms/ChangePasswordForm.vue'
import ResetPasswordForm from '../components/forms/ResetPasswordForm.vue'
import {ErrorService} from './ErrorService';
import {QVueGlobals} from 'quasar';
import {useStore} from 'src/store';
import {Store} from 'vuex';

/**
 * This is a service that is used globally throughout the application for maintaining authentication state as well as
 * signing up, logging in, logging out, changing passwords, and more.
 */

export class AuthenticationService {

    // AWS User Pool
    userPool: AmazonCognitoIdentity.CognitoUserPool

    // Tokens
    accessToken?: AmazonCognitoIdentity.CognitoAccessToken
    idToken?: AmazonCognitoIdentity.CognitoIdToken
    refreshToken?: AmazonCognitoIdentity.CognitoRefreshToken

    // Application info
    appName: string

    // Quasar instance
    $q: QVueGlobals

    // Error handler service
    $errorService: ErrorService

    $store: Store<any>

    constructor(quasar: QVueGlobals, errorService: ErrorService) {
        // Set up authentication pool
        const poolSettings:ICognitoUserPoolData = {
            UserPoolId: process.env.VUE_APP_USER_POOL_ID ?? '',
            ClientId: process.env.VUE_APP_USER_POOL_CLIENT_ID ?? ''
        };
        this.userPool = new AmazonCognitoIdentity.CognitoUserPool(poolSettings)

        // Initialize tokens
        this.accessToken = undefined
        this.idToken = undefined
        this.refreshToken = undefined

        // Quasar & environment variables
        this.$q = quasar
        this.appName = process.env.VUE_APP_NAME ?? 'App'

        // Error service
        this.$errorService = errorService

        this.$store = useStore()
    }

    /**
     * Logs into the AWS authentication pool using the given data
     * @param identifier {string} - the authentication's identifier (usually E-mail or username)
     * @param password {string} - the authentication's password
     */
    async login(identifier: string, password: string): Promise<void>{

        // Generate auth details
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: identifier,
            Password: password
        });

        // Actual Cognito authentication on given pool
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: identifier,
            Pool: this.userPool,
        });

        // Store in local variable
        this.$store.commit('authentication/setCognitoUser', cognitoUser)

        // Execute auth function
        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result)=>{ this.loginSuccess(result)},
                onFailure: (err)=>{ this.onFailure(err) },
                // Sets up MFA (only done once after signing up)
                mfaSetup: (user) => {this.setupMFA(user)},

                // Called in order to select the MFA token type (SOFTWARE_TOKEN_MFA or SMS_TOKEN_MFA)
                selectMFAType: function (challengeName, challengeParameters) {
                    console.log('Select MFA type!', challengeName, challengeParameters)
                    cognitoUser.sendMFASelectionAnswer('SOFTWARE_TOKEN_MFA', this);
                },

                // Called if time-limited one time password is required (only second login or later)
                totpRequired: (tokenType) => {this.verify2FACode(tokenType)},

                //TODO check when this appears
                mfaRequired: function (codeDeliveryDetails) {
                    const verificationCode = prompt('Please input verification code', '');
                    if (typeof verificationCode === 'string') {
                        cognitoUser.sendMFACode(verificationCode, this);
                    }
                },


            })
        })
    }


  /**
   * Sets up MFA for the given cognito user
   * @param cognitoUser {CognitoUser} - the user
   */
  setupMFA(cognitoUser: CognitoUser): void{
      cognitoUser.associateSoftwareToken({
        associateSecretCode: (secret: string) => {this.showQRCodeDialog(secret)},
        onFailure: (err) => {this.onFailure(err)}
      })
    }

  /**
   * Signs up by creating a new authentication using the given Username, e-mail and password.
   * TODO make adaptable to other parameters via direct handling of {attributes} param
   * @param username {string} - the chosen username
   * @param email {string} - the authentication's e-mail address -> TODO move to attributes
   * @param password {string} - the new authentication's chosen password. Must fulfill the set password conditions
   */
  async signUp(username: string, email: string, password: string): Promise<void> {
      const cognitoUserWrapper:any = await new Promise((resolve, reject) => {
          const attributes = [];
          attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: 'email', Value: email}))
          // TODO disable requirement on AWS @thommann
          attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: 'birthdate', Value: '2000-05-12'}))
          console.log(username, password, attributes)
        this.userPool.signUp(username, password, attributes, [], (err?: Error, result?: ISignUpResult) => {
              if (err) {
                // TODO
                  console.log('blubb', err)
                  reject();
              }
              resolve(result);
          })
      })

    this.$store.commit('authentication/setCognitoUser', cognitoUserWrapper.user)

      this.showEmailVerificationDialog()
  }

  /**
   * Logs out the currently logged in authentication (if any)
   */
  logout(): void{
    this.$store.getters['authentication/getCognitoUser']?.signOut(()=>{
        this.$store.commit('authentication/setCognitoUser', undefined)
        this.$store.commit('authentication/setUserSession', undefined)
    })
  }


    /**
     * Shows a dialog for changing password
     */
    showChangePasswordDialog(): void{
        this.$q.dialog({
            component: ChangePasswordForm,
            componentProps: {},
        }).onOk(({passwordNew, passwordOld}: {passwordNew: string, passwordOld: string}) => {
            this.$store.getters['authentication/getCognitoUser']?.changePassword(passwordOld,passwordNew, (err: Error, result: any)=>{
                if(err){
                    this.$errorService.showErrorDialog(err)
                }
            })
        })
    }

    /**
     * Shows a dialog for requesting password reset
     */
    showResetPasswordDialog(): void{
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
            this.$store.commit('authentication/setCognitoUser', new CognitoUser({
                Username: input,
                Pool: this.userPool
            }));

            // Call forgotPassword on cognitoUser
          this.$store.getters['authentication/getCognitoUser']?.forgotPassword({
                onSuccess: function(result: any) {
                    // TODO
                },
                onFailure: (err: Error) => {this.onFailure(err)},
                inputVerificationCode: () => {this.showResetPasswordFormDialog()}
            });
        })
    }

    /**
     * Show actual password reset form dialog
     */
    showResetPasswordFormDialog(): void{
        this.$q.dialog({
            component: ResetPasswordForm,
            componentProps: {},
        }).onOk(({passwordNew, verificationCode}: {passwordNew: string, verificationCode: string}) => {
            this.$store.getters['authentication/getCognitoUser']?.confirmPassword(verificationCode,passwordNew,{
                onSuccess: (result: any)=>{console.log(result)},
                onFailure: (err: Error) => {console.log(err)}
            })
        })

    }

    /**
     * Shows a dialog for verifying E-Mail
     * @param renew {?boolean} - whether to generate a new verification code
     */
    showEmailVerificationDialog(renew = false): void{
        console.log('verify email dialog')

        if(renew){
            if(!this.$store.getters['authentication/getCognitoUser']){
                this.$errorService.showErrorDialog(new Error('An error occurred, try logging in again'))
                return
            } else {
                console.log('Resend confirmation!')
                this.$store.getters['authentication/getCognitoUser'].resendConfirmationCode(() => {
                  // TODO
                })
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
            void this.verifyEmail(input)
        }).onCancel(() => {
            // TODO
        })
    }

    /**
     * Shows a dialog containing a QR code for setting up two factor authentication
     * @param secretCode {string} - the authenticator code to encode in QR code form
     */
    showQRCodeDialog(secretCode: string): void{
        const username = this.$store.getters['authentication/getUsername']
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
                this.$store.getters['authentication/getCognitoUser']?.verifySoftwareToken(code, 'My TOTP device', {
                    onSuccess: (userSession: CognitoUserSession)=>{
                        this.loginSuccess(userSession)
                    },
                    onFailure: (error: Error)=>{
                        this.$errorService.showErrorDialog(error)
                    },
                });
            })
        })
    }

    /**
     * Confirm e-mail verification code
     * @param code
     */
    async verifyEmail(code: string,): Promise<void>{
      const user = this.$store.getters['authentication/getCognitoUser']

      return new Promise((resolve, reject)=>{
          user.confirmRegistration(code, true, (err: Error, result: any)=>{
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
    verify2FACode (tokenType: string): void {
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
            this.$store.getters['authentication/getCognitoUser']?.sendMFACode(code, {
                onSuccess: (userSession: CognitoUserSession)=>{
                    this.loginSuccess(userSession)
                },
                onFailure: (error: Error)=>{
                    this.$errorService.showErrorDialog(error)
                },
            }, tokenType);
        });
    }

    /**
     * When login succeeds
     * @param userSession {CognitoUserSession} - the currently active Cognito authentication session
     */
    loginSuccess(userSession: CognitoUserSession): void{
        // Store locally
        this.$store.commit('authentication/setUserSession', userSession)

        // Get & store tokens
        this.accessToken = userSession.getAccessToken()
        this.idToken = userSession.getIdToken()
        this.refreshToken = userSession.getRefreshToken()
    }

    /**
     * When any operation (mostly login) fails, verify whether it is due to the authentication not having verified their account
     * @param error {Error} - the error that caused the failure
     */
    onFailure(error: Error): void{
        if(error.name === 'UserNotConfirmedException'){
            // Show the e-mail verification dialog and send a new code
            this.showEmailVerificationDialog(true)
        } else {
            this.$errorService.showErrorDialog(error)
        }
    }
}
