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
import {i18n} from 'boot/i18n';
import {useApolloClient} from '@vue/apollo-composable';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';

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

    // Router service
    $routerService: RouterService

    $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>>

  /**
   * Constructor
   * @param {QVueGlobals} quasar - quasar instance
   * @param {ErrorService} errorService - error service instance
   * @param {RouterService} routerService - router service instance
   */
    constructor(quasar: QVueGlobals, errorService: ErrorService, routerService: RouterService) {
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

      // Router service
      this.$routerService = routerService
    }

    /**
     * Logs into the AWS authentication pool using the given data
     * @param {string} identifier - the authentication's identifier (usually E-mail or username)
     * @param {string} password - the authentication's password
     * @param {string} newPassword - the new password if comming from set-password page
     * @returns {Promise<void>} - done
     */
    async login(identifier: string, password: string, newPassword=''): Promise<void>{

      // Generate auth details
      const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
          Username: identifier,
          Password: password
      });

      const userPool = this.$authStore.getters.getUserPool()

      if(userPool === undefined){
        this.$errorService.showErrorDialog(new Error(i18n.global.t('errors.user_not_defined')))
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
          onSuccess: (result) => {
            this.loginSuccess(result);
            resolve()
          },
          onFailure: (err: Error) => {
            this.onFailure(err) 
          },
          // Sets up MFA (only done once after signing up)
          mfaSetup: () => {
            this.setupMFA(cognitoUser, resolve)
          },

        // Called in order to select the MFA token type (SOFTWARE_TOKEN_MFA or SMS_TOKEN_MFA)
          selectMFAType: function () {
            cognitoUser.sendMFASelectionAnswer('SOFTWARE_TOKEN_MFA', this);
          },

          newPasswordRequired: function (userAttributes) {
            while (!newPassword) {
              newPassword = prompt(i18n.global.t('messages.enter_new_password'), '') || '';
            }
            cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);

          },

          // Called if time-limited one time password is required (only second login or later)
          totpRequired: (tokenType: string) => {this.verify2FACode(tokenType, resolve)},

          //TODO check when/if this appears
          mfaRequired: function () {
              const verificationCode = prompt(i18n.global.t('messages.enter_verification_code', ''));
              if (typeof verificationCode === 'string') {
                  cognitoUser.sendMFACode(verificationCode, this);
              }
          },
        })
      })
    }


  /**
   * Sets up MFA for the given cognito user
   * @param {CognitoUser} cognitoUser - the user
   * @param {function} resolve - resolve function
   * @returns {void}
   */
  setupMFA(cognitoUser: CognitoUser, resolve: (value: (void | PromiseLike<void>)) => void): void{
    cognitoUser.associateSoftwareToken({
      associateSecretCode: async (secret: string) => {
        this.$authStore.mutations.setCognitoUser(cognitoUser)
        await this.showQRCodeDialog(secret, cognitoUser)
        await this.showEmailVerificationDialog()
        resolve()
      },
      onFailure: (err: Error) => {this.onFailure(err)}
    })
  }

  /**
   * Signs up by creating a new authentication using the given Username, e-mail and password.
   * TODO make adaptable to other parameters via direct handling of {attributes} param
   * @param {string} username - the chosen username
   * @param {string} email - the authentication's e-mail address -> TODO move to attributes
   * @param {string} password - the new authentication's chosen password. Must fulfill the set password conditions
   * @returns {Promise<void>} - done
   */
  async signUp(username: string, email: string, password: string): Promise<void> {
    const cognitoUserWrapper:ISignUpResult = await new Promise((resolve, reject) => {
      const attributes = [];
      attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: 'email', Value: email}))
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
  }

  /**
   * TODO description, consolidate with signUp() function
   * TODO make adaptable to other parameters via direct handling of {attributes} param
   * @param {string} username - the chosen username
   * @param {string} email - the authentication's e-mail address -> TODO move to attributes
   * @param {string} password - the new authentication's chosen password. Must fulfill the set password conditions
   * @returns {string} the user's cognito ID (sub)
   */
  async signUpNewUser(username: string, email: string, password: string): Promise<string> {
    const cognitoUserWrapper:ISignUpResult = await new Promise((resolve, reject) => {
      const attributes = [];
      attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: 'email', Value: email}))
      this.$authStore.getters.getUserPool()?.signUp(username, password, attributes, [], (err?: Error, result?: ISignUpResult) => {
        if (err) {
          reject(err);
        }
        if(result){
          resolve(result);
        }
      })
    })

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
      this.$errorService.showErrorDialog(new Error(i18n.global.t('errors.not_logged_in')))
    } else {
      // Sign out
      await new Promise<void>((resolve) => {
        cognitoUser.signOut(() => {
          this.$authStore.mutations.setCognitoUser(undefined)
          this.$authStore.mutations.setUserSession(undefined)
          localStorage.clear() // Needed to remove session,id,... tokens
          resolve()
        })
      })

      // Redirect to login
      await this.$routerService.routeTo(ROUTES.LOGIN)

      // Clear cache to prevent erroneous dashboard loading when changing roles
      const apolloClient = useApolloClient()
      await apolloClient.client.clearStore()
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
      this.$errorService.showErrorDialog(new Error(i18n.global.t('errors.user_not_defined')))
      return
    }

    this.$q.dialog({
          title: i18n.global.t('messages.reset_password'),
          message: i18n.global.t('messages.enter_username'),
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
                // Do nothing
              },
              onFailure: (err: Error) => {
                this.$authStore.mutations.setCognitoUser(undefined);
                this.onFailure(err)
              },
              inputVerificationCode: () => {
                this.showResetPasswordFormDialog()
              }
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
              onSuccess: (result: unknown)=>{
                console.log(result)
              },
              onFailure: (err: Error) => {
                console.error(err)
              }
          })
      })

  }

  /**
   * Shows a dialog for verifying E-Mail
   * @returns {void}
   */
  async showEmailVerificationDialog(): Promise<void>{
    await new Promise((resolve, reject) => {
      this.$authStore.getters.getCognitoUser()?.getAttributeVerificationCode('email', {
        onSuccess(success: string): void {
          console.log(success)
          resolve(null)
        },
        onFailure: (err: Error) => {
          console.error(err)
          reject()
        }
      })
    })
    await new Promise((resolve, reject) => {
      this.$q.dialog({
        title: i18n.global.t('messages.verification'),
        message: i18n.global.t('messages.enter_verification_code'),
        cancel: true,
        persistent: true,
        prompt: {
          model: '',
          isValid: (val: string) => val.length === 6,
          type: 'text'
        },
      }).onOk((input: string) => {
          this.$authStore.getters.getCognitoUser()?.verifyAttribute('email', input, {
            onSuccess(success: string): void {
              console.log(success)
              resolve(null)
            },
            onFailure: (err: Error) => {
              console.error(err)
              reject()
            }
          })
        })
      })

  }

  /**
   * Shows a dialog containing a QR code for setting up two factor authentication
   * @param {string} secretCode - the authenticator code to encode in QR code form
   * @param {CognitoUser} cognitoUser - the cognito user to show the dialog for
   * @returns {void}
   */
  showQRCodeDialog(secretCode: string, cognitoUser: CognitoUser): Promise<void>{
    return new Promise((resolve)=>{
      const username = this.$authStore.getters.getUsername() ?? 'user'

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
          cognitoUser.verifySoftwareToken(code, 'SOI TOTP device', {
            onSuccess: (userSession: CognitoUserSession) => {
              this.loginSuccess(userSession)
              resolve()
            },
            onFailure: (error: Error)=>{
              this.onFailure(error)
            },
          });
        })
      })
    })
  }

  /**
   * Confirm e-mail verification code
   * @param {string} code -verification code
   * @returns {Promise<void>} - done
   */
  async verifyEmail(code: string): Promise<void>{
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
          title: i18n.global.t('messages.verification'),
          message: i18n.global.t('messages.enter_2fa'),
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
          onSuccess: (userSession: CognitoUserSession) => {
            this.$authStore.mutations.setCognitoUser(currentUser)
            this.loginSuccess(userSession)
            resolve()
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
   * @returns {void}
   */
  loginSuccess(userSession: CognitoUserSession): void {
    // Store locally
    this.$authStore.mutations.setUserSession(userSession)
  }

  /**
   * When any operation (mostly login) fails, verify whether it is due to the authentication not having verified their account
   * @param {Error} error - the error that caused the failure
   * @returns {void}
   */
  onFailure(error: Error): void{
      if(error.name === 'UserNotConfirmedException'){
          // Show the e-mail verification dialog and send a new code
          void this.showEmailVerificationDialog()
      } else {
        this.$errorService.showErrorDialog(error)
      }
  }

  /**
   * Refreshes the idToken if necessary
   * @returns {Promise<void>} - done
   */
  refreshToken(): Promise<void>{
    return new Promise((resolve, reject)=> {
      const userSession =  this.$authStore.getters.getUserSession()
      const idTokenExpiration = userSession?.getIdToken().getExpiration()
      if(!idTokenExpiration){
        resolve()
      }
      const refreshToken =userSession?.getRefreshToken()
      if(refreshToken && (idTokenExpiration ||0 - Date.now() < 45 * 60)){   //15min before de-validation token is refreshed
        const currentUser: CognitoUser|undefined = _.cloneDeep(this.$authStore.getters.getCognitoUser()) //refresh session mutates the state of store: illegal
        currentUser?.refreshSession(refreshToken, (err, session )=> {
          if (session) {
            this.$authStore.mutations.setCognitoUser(currentUser)
            this.$authStore.mutations.setUserSession(session as CognitoUserSession | undefined)
            resolve()
          } else {
            reject(err)
          }
        })
      }
      resolve()
    })
  }
}
