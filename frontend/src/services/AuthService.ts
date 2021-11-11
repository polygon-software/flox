import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {CognitoUser, CognitoUserSession,
  ISignUpResult
} from 'amazon-cognito-identity-js';
import QrCodeDialog from '../components/dialogs/QrCodeDialog.vue'
import ChangePasswordDialog from 'components/dialogs/ChangePasswordDialog.vue'
import ResetPasswordDialog from 'components/dialogs/ResetPasswordDialog.vue'
import {ErrorService} from './ErrorService';
import {QVueGlobals} from 'quasar';
import {useAuth} from 'src/store/authentication';
import _ from 'lodash';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';
import {Ref} from 'vue';

/**
 * This is a service that is used globally throughout the application for maintaining authentication state as well as
 * signing up, logging in, logging out, changing passwords, and more.
 */

export class AuthenticationService {
    // Application info
    appName: string

    // Quasar instance
    $q: QVueGlobals

    // Error handler service
    $errorService: Ref<ErrorService>

    $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>>

    constructor(quasar: QVueGlobals, errorService: Ref<ErrorService>) {
      // Store
      this.$authStore = useAuth()

      // Set up authentication user pool
      const poolSettings = {
          UserPoolId: process.env.VUE_APP_USER_POOL_ID ?? '',
          ClientId: process.env.VUE_APP_USER_POOL_CLIENT_ID ?? ''
      };
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolSettings)
      this.$authStore.mutations.setUserPool(userPool)


      // Quasar & environment variables
      this.$q = quasar
      this.appName = process.env.VUE_APP_NAME ?? 'App'

      // Error service
      this.$errorService = errorService
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

        const userPool = this.$authStore.getters.getUserPool()

        if(userPool === undefined){
          this.$errorService.value.showErrorDialog(new Error('User Pool is not defined'))
          return
        }
          // Actual Cognito authentication on given pool
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: identifier,
            Pool: userPool,
        });

        // Execute auth function
        return new Promise((resolve:  (value: (void | PromiseLike<void>)) => void) => {
          // Store in local variable
          this.$authStore.mutations.setCognitoUser(cognitoUser)
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result)=>{ this.loginSuccess(result, resolve)},
                onFailure: (err)=>{this.onFailure(err) },
                // Sets up MFA (only done once after signing up)
                mfaSetup: (challengeName, challengeParameters) => {

                  console.log('challenge:', typeof challengeName, challengeParameters)
                  this.setupMFA(cognitoUser, resolve)
                },

              // Called in order to select the MFA token type (SOFTWARE_TOKEN_MFA or SMS_TOKEN_MFA)
                selectMFAType: function () {
                    cognitoUser.sendMFASelectionAnswer('SOFTWARE_TOKEN_MFA', this);
                },

                // Called if time-limited one time password is required (only second login or later)
                totpRequired: (tokenType) => {this.verify2FACode(tokenType, resolve)},

                //TODO check when/if this appears
                mfaRequired: function () {
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
   * @param resolve {(value: (void | PromiseLike<void>)) => void}
   */
  setupMFA(cognitoUser: CognitoUser, resolve: (value: (void | PromiseLike<void>)) => void): void{
    const user = _.cloneDeep(cognitoUser)
    user.associateSoftwareToken({
        associateSecretCode: (secret: string) => {this.showQRCodeDialog(secret, resolve)},
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
    const cognitoUserWrapper:ISignUpResult = await new Promise((resolve, reject) => {
        const attributes = [];
        attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: 'email', Value: email}))
        // TODO disable requirement on AWS @thommann
        attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: 'birthdate', Value: '2000-05-12'}))

      this.$authStore.getters.getUserPool()?.signUp(username, password, attributes, [], (err?: Error, result?: ISignUpResult) => {
            if (err) {
              // TODO
                console.error(err)
                reject();
            }
            if(result){
              resolve(result);
            }
        })
    })

    this.$authStore.mutations.setCognitoUser(cognitoUserWrapper.user)
    this.showEmailVerificationDialog()
  }

  /**
   * Logs out the currently logged in authentication (if any)
   */
  async logout(): Promise<void>{
    // Deep copy to avoid mutating store state
    const cognitoUser: CognitoUser|undefined = _.cloneDeep(this.$authStore.getters.getCognitoUser())

    if(!cognitoUser){
      this.$errorService.value.showErrorDialog(new Error('Trying to log out despite not being logged in!'))
    } else {
      return new Promise((resolve) => {
        cognitoUser.signOut(() => {
          this.$authStore.mutations.setCognitoUser(undefined)
          this.$authStore.mutations.setUserSession(undefined)
          resolve()
        })
      })
    }
  }


    /**
     * Shows a dialog for changing password
     */
    showChangePasswordDialog(): void{
        this.$q.dialog({
            component: ChangePasswordDialog,
            componentProps: {},
        }).onOk(({passwordNew, passwordOld}: {passwordNew: string, passwordOld: string}) => {
            this.$authStore.getters.getCognitoUser()?.changePassword(passwordOld,passwordNew, (err: Error|undefined)=>{
                if(err){
                    this.$errorService.value.showErrorDialog(err)
                }
            })
        })
    }

    /**
     * Shows a dialog for requesting password reset
     */
    showResetPasswordDialog(): void{
      const userPool = this.$authStore.getters.getUserPool()

      if(userPool === undefined){
        this.$errorService.value.showErrorDialog(new Error('User Pool is not defined'))
        return
      }

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
            this.$authStore.mutations.setCognitoUser(new CognitoUser({
                Username: input,
                Pool: userPool
            }));

            // Call forgotPassword on cognitoUser
          this.$authStore.getters.getCognitoUser()?.forgotPassword({
                onSuccess: function() {
                    // TODO
                },
                onFailure: (err: Error) => {
                  this.$authStore.mutations.setCognitoUser(undefined);
                  this.onFailure(err)
                },
                inputVerificationCode: () => {this.showResetPasswordFormDialog()}
            });
        })
    }

    /**
     * Show actual password reset form dialog
     */
    showResetPasswordFormDialog(): void{
        this.$q.dialog({
            component: ResetPasswordDialog,
            componentProps: {},
        }).onOk(({passwordNew, verificationCode}: {passwordNew: string, verificationCode: string}) => {
            this.$authStore.getters.getCognitoUser()?.confirmPassword(verificationCode,passwordNew,{
                onSuccess: (result: unknown)=>{console.log(result)},
                onFailure: (err: Error) => {console.log(err)}
            })
        })

    }

    /**
     * Shows a dialog for verifying E-Mail
     * @param renew {?boolean} - whether to generate a new verification code
     */
    showEmailVerificationDialog(renew = false): void{
        if(renew){
            if(!this.$authStore.getters.getCognitoUser()){
                this.$errorService.value.showErrorDialog(new Error('An error occurred, try logging in again'))
                return
            } else {
                this.$authStore.getters.getCognitoUser()?.resendConfirmationCode(() => {
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
     * @param resolve { (value: (void | PromiseLike<void>)) => void}
     */
    showQRCodeDialog(secretCode: string, resolve: (value: (void | PromiseLike<void>)) => void): void{
      const username = this.$authStore.getters.getUsername() ?? 'user'

      const codeUrl = `otpauth://totp/${this.appName}:${username}?secret=${secretCode}&Issuer=${this.appName}`
      console.log(this.$q)
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
              this.$authStore.getters.getCognitoUser()?.verifySoftwareToken(code, 'My TOTP device', {
                  onSuccess: (userSession: CognitoUserSession)=>{
                    this.loginSuccess(userSession, resolve)
                  },
                  onFailure: (error: Error)=>{
                    this.onFailure(error)
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
      return new Promise((resolve, reject)=>{
          this.$authStore.getters.getCognitoUser()?.confirmRegistration(code, true, (err: Error)=>{
              if(err){
                  console.error(err)
                  reject()
              }
              resolve()
          })
      })
    }

    /**
     * Verifies a given 2FA code
     * @param tokenType {string} - the type of token to verify
     * @param resolve { (value: (void | PromiseLike<void>)) => void}
     */
    verify2FACode (tokenType: string, resolve:  (value: (void | PromiseLike<void>)) => void): void {
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
          // Deep copy user so state object does not get altered
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const currentUser: CognitoUser|undefined = _.cloneDeep(this.$authStore.getters.getCognitoUser())
          currentUser?.sendMFACode(code, {
            onSuccess: (userSession: CognitoUserSession)=>{
                this.loginSuccess(userSession, resolve)
            },
            onFailure: (error: Error)=>{
                this.onFailure(error)
            },
        }, tokenType);
        });
    }

    /**
     * When login succeeds
     * @param userSession {CognitoUserSession} - the currently active Cognito authentication session
     * @param resolve {(value: (void | PromiseLike<void>)) => void}
     */
    loginSuccess(userSession: CognitoUserSession, resolve:  (value: (void | PromiseLike<void>)) => void): void{
      // Store locally
      this.$authStore.mutations.setUserSession(userSession)

      resolve()
    }

    /**
     * When any operation (mostly login) fails, verify whether it is due to the authentication not having verified their account
     * @param error {Error} - the error that caused the failure
     */
    onFailure(error: Error): void{
      console.error('Error', Error)
        if(error.name === 'UserNotConfirmedException'){
            // Show the e-mail verification dialog and send a new code
            this.showEmailVerificationDialog(true)
        } else {
          console.log(this.$errorService)
          this.$errorService.value.showErrorDialog(error)
        }
    }
}
