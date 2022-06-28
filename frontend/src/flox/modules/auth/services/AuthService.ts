import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {CognitoUser, CognitoUserSession,
  ISignUpResult
} from 'amazon-cognito-identity-js';
import QrCodeDialog from '../components/dialogs/QrCodeDialog.vue'
import ChangePasswordDialog from '../components/dialogs/ChangePasswordDialog.vue'
import ResetPasswordDialog from '../components/dialogs/ResetPasswordDialog.vue'
import EmailConfirmationDialog from '../components/dialogs/EmailConfirmationDialog.vue'
import {QVueGlobals, useQuasar} from 'quasar';
import {useAuth} from 'src/store/authentication';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';
import {i18n} from 'boot/i18n';
import {useApolloClient} from '@vue/apollo-composable';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {ErrorService} from 'src/services/ErrorService';
import * as auth from 'src/flox/modules/auth'
import {createUser} from 'src/helpers/data/mutation-helpers';
import {showNotification} from 'src/helpers/tools/notification-helpers';
import {cloneDeep} from 'lodash';

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
  interval: ReturnType<typeof setInterval>| null;

  /**
   * Constructor
   * @param {QVueGlobals} quasar - Quasar instance
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

    // Every 5 minutes, check whether token is still valid
    if (!process.env.SERVER) {
      this.interval = setInterval(() => {
        void this.refreshToken()
      }, 1000 * 60 * 5)
    } else {
      this.interval = null
    }
  }

  /**
   * Logs into the AWS authentication pool using the given data
   * @param {string} identifier - the authentication's identifier (usually E-mail or username)
   * @param {string} password - the authentication's password
   * @param {string} newPassword - the new password if this function is triggered from set-password page
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
          void this.loginSuccess(result);
          resolve()
        },
        onFailure: (err: Error) => {
          this.onFailure(err, identifier, password)
        },
        // Sets up MFA & logs in (only done once after signing up)
        mfaSetup: () => {
          this.setupMFA(cognitoUser, resolve, identifier)
        },

        // Called in order to select the MFA token type (SOFTWARE_TOKEN_MFA or SMS_TOKEN_MFA)
        selectMFAType: function () {
          cognitoUser.sendMFASelectionAnswer('SOFTWARE_TOKEN_MFA', this);
        },

        // Called when user is in FORCE_PASSWORD_CHANGE state and must thus set a new password
        newPasswordRequired: function (userAttributes) {
          const attrs = cloneDeep(userAttributes) as Record<string, unknown>

          // Show password change dialog
          while (!newPassword) {
            const $q = useQuasar();
            $q.dialog({
              component: ChangePasswordDialog,
              componentProps: {},
            }).onOk(({password}: {password: string}) => {
              newPassword = password
            })
          }
          // Ensure e-mail doesn't get passed, so cognito doesn't recognize it as change
          delete attrs.email
          cognitoUser.completeNewPasswordChallenge(newPassword, attrs, this);
        },

        // Called if time-limited one time password is required (only second login or later)
        totpRequired: (tokenType: string) => {this.verify2FACode(tokenType, resolve)},

        // MFA code required (NOT part of normal flow)
        mfaRequired: function () {
          const verificationCode = prompt(i18n.global.t('messages.enter_verification_code', ''));
          if (typeof verificationCode === 'string') {
            cognitoUser.sendMFACode(verificationCode, this)
          }
        },
      })
    })
  }


  /**
   * Sets up MFA for the given cognito user
   * @param {CognitoUser} cognitoUser - the user
   * @param {function} resolve - resolve function
   * @param {string} identifier - identifier (username of email)
   * @returns {void}
   */
  setupMFA(cognitoUser: CognitoUser, resolve: (value: (void | PromiseLike<void>)) => void, identifier: string): void{
    cognitoUser.associateSoftwareToken({
      associateSecretCode: async (secret: string) => {
        this.$authStore.mutations.setCognitoUser(cognitoUser)
        await this.showQRCodeDialog(secret, cognitoUser, identifier)
        resolve()
      },
      onFailure: (err: Error) => {
        this.onFailure(err)
      }
    })
  }

  /**
   * Signs up by creating a new authentication using the given Username, e-mail and password.
   * @param {string} username - the chosen username
   * @param {string} email - the authentication's e-mail address
   * @param {string} password - the new authentication's chosen password. Must fulfill the set password conditions
   * @param {Record<string, string>}  [attributes] - custom attributes to add (if any)
   * @returns {Promise<void>} - done
   */
  async signUp(username: string, email: string, password: string, attributes?: Record<string, string>): Promise<void> {
    const cognitoUserWrapper:ISignUpResult = await new Promise((resolve, reject) => {
      const userAttributes = [];

      // Add e-mail to attributes
      userAttributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: 'email', Value: email}))

      // Handle custom attributes
      if(attributes){
        Object.keys(attributes).forEach((attributeKey) => {
          userAttributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: attributeKey, Value: attributes[attributeKey]}))
        })
      }

      // Trigger signup
      this.$authStore.getters.getUserPool()?.signUp(username, password, userAttributes, [], (err?: Error, result?: ISignUpResult) => {
        if (err) {
          this.$errorService.showErrorDialog(err)
          reject();
        }
        if(result){
          resolve(result);
        }
      })
    })

    // Register in database TODO application specific: apply any other attributes here as well
    await createUser(username, email, cognitoUserWrapper.userSub)
  }

  /**
   * Logs out the currently logged in authentication (if any)
   * @returns {void}
   */
  async logout(): Promise<void>{
    // Deep copy to avoid mutating store state
    const cognitoUser: CognitoUser|undefined = cloneDeep(this.$authStore.getters.getCognitoUser())

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

      // Clear cache to prevent erroneous loading when changing roles
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

    const isEmailUsername = auth.moduleConfig().emailAsUsername

    this.$q.dialog({
      title: i18n.global.t('messages.reset_password'),
      message: i18n.global.t(`messages.enter_${isEmailUsername ? 'email' : 'username'}`),
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
        onSuccess: ()=>{
          showNotification(
            this.$q,
            i18n.global.t('messages.password_changed'),
            'bottom',
            'positive'
          )
        },
        onFailure: (err: Error) => {
          this.$errorService.showErrorDialog(err)
        }
      })
    })

  }

  /**
   * Resends the e-mail configuration code for the current user
   * @returns {Promise<void>} - done
   */
  async resendEmailVerificationCode(){
    await new Promise((resolve, reject) => {
      this.$authStore.getters.getCognitoUser()?.resendConfirmationCode(function(err) {
        if (!err) {
          resolve(null)
        }
        reject()
      })
    })
  }

  /**
   * Shows a dialog for verifying E-Mail
   * @returns {void}
   */
  async showEmailVerificationDialog(): Promise<void>{
    await new Promise((resolve, reject) => {
      this.$q.dialog({
        component: EmailConfirmationDialog,
        componentProps: {
          q: this.$q,
          authService: this,
        }
      }).onOk(({code}: { code: string }) => {
        this.$authStore.getters.getCognitoUser()?.confirmRegistration(code, true, function(err, result) {
          if (!err) {
            resolve(result)
          }
          reject()
        })
      })
    })

  }

  /**
   * Shows a dialog containing a QR code for setting up two factor authentication
   * @param {string} secretCode - the authenticator code to encode in QR code form
   * @param {CognitoUser} cognitoUser - the cognito user to show the dialog for
   * @param {string} identifier - identifier (username of email)
   * @returns {void}
   */
  showQRCodeDialog(secretCode: string, cognitoUser: CognitoUser, identifier: string): Promise<void>{
    return new Promise((resolve)=>{

      const codeUrl = `otpauth://totp/${this.appName} (${identifier})?secret=${secretCode}&Issuer=${this.appName}`
      this.$q.dialog({
        component: QrCodeDialog,
        componentProps: {
          value: codeUrl
        },
      }).onOk(() => {
        // Verify code
        this.$q.dialog({
          title: i18n.global.t('authentication.verification'),
          message: i18n.global.t('authentication.verification_message'),
          cancel: true,
          persistent: true,
          prompt: {
            model: '',
            isValid: (val: string) => val.length >= 6,
            type: 'text'
          },
        }).onOk((code: string) => {
          cognitoUser.verifySoftwareToken(code, 'TOTP Device', {
            onSuccess: (userSession: CognitoUserSession) => {
              void this.loginSuccess(userSession)
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
      const currentUser: CognitoUser|undefined = cloneDeep(this.$authStore.getters.getCognitoUser())
      currentUser?.sendMFACode(code, {
        onSuccess: (userSession: CognitoUserSession) => {
          this.$authStore.mutations.setCognitoUser(currentUser)
          void this.loginSuccess(userSession)
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
   * @returns {Promise<void>} - done
   */
  async loginSuccess(userSession: CognitoUserSession) {
    // Store locally
    this.$authStore.mutations.setUserSession(userSession)

    // Redirect to main page TODO application specific: choose correct route
    await this.$routerService?.routeTo(ROUTES.SAMPLE)
  }

  /**
   * When any operation (mostly login) fails, verify whether it is due to the authentication not having verified their account
   * @param {Error} error - the error that caused the failure
   * @param {string} [identifier] - the authentication's identifier (usually E-mail or username) for re-login
   * @param {string} [password] - the authentication's password for re-login
   * @returns {void}
   */
  onFailure(error: Error, identifier?: string, password?: string): void{
    switch(error.name){
      // Case 1: User has not verified their e-mail yet
      case 'UserNotConfirmedException':
        void this.showEmailVerificationDialog().then(() => {
          if(identifier && password){
            // Retry login
            void this.login(identifier, password)
          }
        })
        break;
      // Case 2: User must reset password (e.g. if forced via AWS console)
      case 'PasswordResetRequiredException':
        // Call forgotPassword on cognitoUser, since user must reset password
        this.$authStore.getters.getCognitoUser()?.forgotPassword({
          onSuccess: function() {
            const $q = useQuasar()

            // Show success notification
            showNotification(
             $q,
             i18n.global.t('messages.password_changed'),
             'bottom',
             'positive'
            )
          },
          onFailure: (err: Error) => {
            this.$authStore.mutations.setCognitoUser(undefined);
            this.onFailure(err)
          },
          inputVerificationCode: () => {
            this.showResetPasswordFormDialog()
          }
        });
        break;
      // Default: any other error
      default:
        this.$errorService.showErrorDialog(error)
        break;
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
      const refreshToken = userSession?.getRefreshToken()
      if(refreshToken && idTokenExpiration && (idTokenExpiration - Date.now() / 1000 < 45 * 60)){   // 15min before de-validation token is refreshed
        const currentUser: CognitoUser|undefined = cloneDeep(this.$authStore.getters.getCognitoUser()) // refresh session mutates the state of store: illegal
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
      else {
        resolve()
      }
    })
  }
}
