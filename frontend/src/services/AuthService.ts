import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {CognitoUser, CognitoUserSession,
  ISignUpResult
} from 'amazon-cognito-identity-js';
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
import {i18n} from 'boot/i18n';
import {executeQuery} from 'src/helpers/data-helpers';
import {MY_USER} from 'src/data/queries/USER';

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
    $errorService: ErrorService

    $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>>

  /**
   * Constructor
   * @param {QVueGlobals} quasar - quasar instance
   * @param {ErrorService} errorService - error service instance
   */
    constructor(quasar: QVueGlobals, errorService: ErrorService) {
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
     * @param {string} identifier - the authentication's identifier (usually E-mail or username)
     * @param {string} password - the authentication's password
     * @async
     * @returns {void}
     */
    async login(identifier: string, password: string): Promise<void>{
      // Generate auth details
      const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
          Username: identifier,
          Password: password
      });

      const userPool = this.$authStore.getters.getUserPool()

      if(userPool === undefined){
        this.$errorService.showErrorDialog(new Error('User Pool is not defined'))
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
            onSuccess: (result)=>{
              void this.loginSuccess(result, resolve)
            },
            onFailure: (err: Error)=>{this.onFailure(err) },
        })
      })
    }

  /**
   * Signs up by creating a new authentication using the given Username, e-mail and password.
   * @param {string} username - the chosen username
   * @param {string} email - the authentication's e-mail address
   * @param {string} password - the new authentication's chosen password. Must fulfill the set password conditions
   * @async
   * @returns {string} - the cognito user's UUID
   */
  async signUp(username: string, email: string, password: string): Promise<string> {
    const cognitoUserWrapper:ISignUpResult = await new Promise((resolve, reject) => {
      const attributes = [];
      attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: 'email', Value: email}))
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

    return cognitoUserWrapper.userSub
  }

  /**
   * Logs out the currently logged in authentication (if any)
   * @returns {void}
   */
  async logout(): Promise<void>{
    // Deep copy to avoid mutating store state
    const cognitoUser: CognitoUser|undefined = _.cloneDeep(this.$authStore.getters.getCognitoUser())

    if(!cognitoUser){
      this.$errorService.showErrorDialog(new Error('Trying to log out despite not being logged in!'))
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
     * @returns {void}
     */
    showChangePasswordDialog(): void{
        this.$q.dialog({
            component: ChangePasswordDialog,
            componentProps: {},
        }).onOk(({passwordNew, passwordOld}: {passwordNew: string, passwordOld: string}) => {
            this.$authStore.getters.getCognitoUser()?.changePassword(passwordOld,passwordNew, (err: Error|undefined)=>{
                if(err){
                    this.$errorService.showErrorDialog(err)
                }
            })
        })
    }

    /**
     * Shows a dialog for requesting password reset
     * @returns {void}
     */
    showResetPasswordDialog(): void{
      const userPool = this.$authStore.getters.getUserPool()

      if(userPool === undefined){
        this.$errorService.showErrorDialog(new Error('User Pool is not defined'))
        return
      }

      this.$q.dialog({
            title: i18n.global.t('authentication.reset_password'),
            message: i18n.global.t('authentication.please_enter_username'),
            cancel: {
              label: i18n.global.t('buttons.cancel'),
              flat: true,
            },
            ok: {
              label: i18n.global.t('buttons.ok'),
            },
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
     * @returns {void}
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
     * @param {boolean} [renew=false] - whether to generate a new verification code
     * @returns {Promise<void>} - async
     */
    async showEmailVerificationDialog(renew = false): Promise<void>{
      return new Promise((resolve, reject)=> {

        if (renew) {
          if (!this.$authStore.getters.getCognitoUser()) {
            this.$errorService.showErrorDialog(new Error('An error occurred, try logging in again'))
            return
          } else {
            this.$authStore.getters.getCognitoUser()?.resendConfirmationCode(() => {
              console.log('resend code')
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
          this.verifyEmail(input).then(resolve).catch(reject)
        }).onCancel(() => {
          reject()
        })
      })
    }

    /**
     * Confirm e-mail verification code
     * @param {string} code -verification code
     * @async
     * @returns {void}
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
     * @param {string} tokenType - the type of token to verify
     * @param {function} resolve - resolve function
     * @returns {void}
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
              this.$authStore.mutations.setCognitoUser(currentUser)
              void this.loginSuccess(userSession, resolve)
            },
            onFailure: (error: Error)=>{
              this.onFailure(error)
            },
        }, tokenType);
        });
    }

    /**
     * When login succeeds
     * @param {CognitoUserSession} userSession - the currently active Cognito authentication session
     * @param {function} resolve - resolve function
     * @returns {void}
     */
    async loginSuccess(userSession: CognitoUserSession, resolve:  (value: (void | PromiseLike<void>)) => void): Promise<void>{

      // Store locally
      this.$authStore.mutations.setUserSession(userSession)

      // Upon login, fetch my user to check status
      const queryResult = await executeQuery(MY_USER) as unknown as Record<string, Record<string, unknown>>

      // No valid user: show error
      if(!queryResult?.data?.myUser){
        // Auto-logout
        await this.logout();

        // Generic error
        this.$errorService.showErrorDialog(new Error('An error occurred, try logging in again'))
        return;
      }

      resolve()
    }

    /**
     * When any operation (mostly login) fails, verify whether it is due to the authentication not having verified their account
     * @param {Error} error - the error that caused the failure
     * @returns {void}
     */
    onFailure(error: Error): void{
      // Depending on error, show appropriate dialog
      if(error.name === 'UserNotConfirmedException'){
        // Show the e-mail verification dialog and send a new code
        this.showEmailVerificationDialog(true).catch(() => {
          this.$errorService.showErrorDialog(new Error('Something went wrong while verifying email.'))
        })
      } else {
        // Generic error
        this.$errorService.showErrorDialog(error)
      }
    }
}
