import { useApolloClient } from '@vue/apollo-composable';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import {
  CognitoUser,
  CognitoUserSession,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import cloneDeep from 'lodash/cloneDeep';
import { QVueGlobals, useQuasar } from 'quasar';

import { i18n } from 'boot/i18n';
import Env from 'src/env';
import AdminCreatedUser from 'src/flox/modules/auth/data/types/AdminCreatedUser';
import { showSuccessNotification } from 'src/tools/notification.tool';

import { useAuthStore } from '../stores/auth.store';
import ROUTES from '../../../../router/routes';
import ErrorService from '../../../../services/ErrorService';
import RouterService from '../../../../services/RouterService';
import ForgotPasswordDialog from '../components/dialogs/ForgotPasswordDialog.vue';
import ChangePasswordDialog from '../components/dialogs/ChangePasswordDialog.vue';
import EmailConfirmationDialog from '../components/dialogs/EmailConfirmationDialog.vue';
import QrCodeDialog from '../components/dialogs/QrCodeDialog.vue';
import ResetPasswordDialog from '../components/dialogs/ResetPasswordDialog.vue';
import MFADialog from '../components/dialogs/MFADialog.vue';
import DELIVERY_MEDIUMS from '../../../enum/DELIVERY_MEDIUMS';
import ROLE from '../../../enum/USER_ROLES';

import { adminCreateUser, signup } from './user.service';

const userNotDefinedError = i18n.global.t('errors.user_not_defined');

/**
 * This is a service that is used globally throughout the application for maintaining authentication state as well as
 * signing up, logging in, logging out, changing passwords, and more.
 */
export default class AuthenticationService {
  // Application info
  appName: string;

  // Quasar instance
  $q: QVueGlobals;

  // Error handler service
  $errorService: ErrorService;

  // Router service
  $routerService: RouterService;

  $authStore: ReturnType<typeof useAuthStore>;

  interval: ReturnType<typeof setInterval> | null;

  /**
   * Constructor
   *
   * @param quasar - Quasar instance
   * @param errorService - error service instance
   * @param routerService - router service instance
   */
  constructor(
    quasar: QVueGlobals,
    errorService: ErrorService,
    routerService: RouterService
  ) {
    // Store
    this.$authStore = useAuthStore();

    // Set up authentication user pool
    const poolSettings = {
      UserPoolId: Env.VUE_APP_USER_POOL_ID,
      ClientId: Env.VUE_APP_USER_POOL_CLIENT_ID,
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolSettings);
    this.$authStore.setUserPool(userPool);

    // Quasar & environment variables
    this.$q = quasar;
    this.appName = Env.VUE_APP_NAME;

    // Error service
    this.$errorService = errorService;

    // Router service
    this.$routerService = routerService;

    // Every 5 minutes, check whether token is still valid
    if (!Env.SERVER) {
      this.interval = setInterval(() => {
        void this.refreshToken();
      }, 1000 * 60 * 5);
    } else {
      this.interval = null;
    }
  }

  /**
   * Logs into the AWS authentication pool using the given data
   *
   * @param identifier - the authentication's identifier (usually E-mail or username)
   * @param password - the authentication's password
   * @param q - Quasar instance (for opening dialogs)
   * @param [newPassword] - the new password if this function is triggered from set-password page
   */
  async login(
    identifier: string,
    password: string,
    q: QVueGlobals,
    newPassword = ''
  ): Promise<void> {
    // Generate auth details
    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails({
        Username: identifier,
        Password: password,
      });

    const { userPool } = this.$authStore;

    if (!userPool) {
      this.$errorService.showErrorDialog(new Error(userNotDefinedError));
      return undefined;
    }
    // Actual Cognito authentication on given pool
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: identifier,
      Pool: userPool,
    });

    // Execute auth function
    return new Promise((resolve) => {
      // Store in local variable
      this.$authStore.setCognitoUser(cognitoUser);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          void this.loginSuccess(result);
          resolve();
        },
        onFailure: (err: Error) => {
          this.onFailure(err, identifier, password);
        },
        // Sets up MFA & logs in (only done once after signing up)
        mfaSetup: () => {
          this.setupMFA(cognitoUser, resolve, identifier);
        },

        // Called in order to select the MFA token type (SOFTWARE_TOKEN_MFA or SMS_TOKEN_MFA)
        selectMFAType() {
          cognitoUser.sendMFASelectionAnswer('SOFTWARE_TOKEN_MFA', this);
        },

        // Called when user is in FORCE_PASSWORD_CHANGE state and must thus set a new password
        newPasswordRequired(
          userAttributes: Record<string, unknown>, // all user attributes (e.g. 'email', 'email_verified')
          requiredAttributes: string[] // list of attributes that must be passed in order to update password (usually none)
        ) {
          // Build list of required attributes (for most user pools, this will be left empty)
          const attributes: Record<string, unknown> = {};
          if (requiredAttributes?.length > 0) {
            Object.keys(userAttributes).forEach((key) => {
              if (requiredAttributes.includes(key)) {
                attributes[key] = userAttributes[key];
              }
            });
          }

          // Case 1: Password already given; complete directly
          if (newPassword) {
            cognitoUser.completeNewPasswordChallenge(
              newPassword,
              attributes,
              this
            );
            return;
          }

          // Case 2: No password given: show dialog for setting new one
          q.dialog({
            component: ChangePasswordDialog,
          }).onOk(({ passwordNew }: { passwordNew: string }) => {
            cognitoUser.completeNewPasswordChallenge(
              passwordNew,
              attributes,
              this
            );
          });
        },

        // Called if time-limited one time password is required (only second login or later)
        totpRequired: (tokenType: string) => {
          this.verify2FACode(tokenType, resolve);
        },

        // MFA code required (NOT part of normal flow)
        mfaRequired() {
          const verificationCode = prompt(
            i18n.global.t('messages.enter_verification_code', '')
          );
          if (typeof verificationCode === 'string') {
            cognitoUser.sendMFACode(verificationCode, this);
          }
        },
      });
    });
  }

  /**
   * Sets up MFA for the given cognito user
   *
   * @param cognitoUser - the user
   * @param resolve - resolve function
   * @param identifier - identifier (username of email)
   */
  setupMFA(
    cognitoUser: CognitoUser,
    resolve: (value: void | PromiseLike<void>) => void,
    identifier: string
  ): void {
    cognitoUser.associateSoftwareToken({
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      associateSecretCode: async (secret: string) => {
        this.$authStore.setCognitoUser(cognitoUser);
        await this.showQRCodeDialog(secret, cognitoUser, identifier);
        resolve();
      },
      onFailure: (err: Error) => {
        this.onFailure(err);
      },
    });
  }

  /**
   * Lets an admin create a new user
   * @param username - the chosen username
   * @param email - the authentication's e-mail address
   * @param role - the user's role
   * @param deliveryMediums - medium to use to deliver user's new login information (sms, email, both or none)
   * @param [phoneNumber] - number to send the SMS invitation to
   * @param [locale] - the chosen language locale
   * @returns - the newly created user
   */
  // eslint-disable-next-line class-methods-use-this
  async adminCreateUser(
    username: string,
    email: string,
    role: ROLE,
    deliveryMediums: DELIVERY_MEDIUMS[],
    phoneNumber?: string,
    locale?: string
  ): Promise<AdminCreatedUser | null> {
    // Register in database TODO application specific: apply any other attributes here as well
    return adminCreateUser(
      username,
      email,
      role,
      deliveryMediums,
      phoneNumber,
      locale
    );
  }

  /**
   * Signs up by creating a new authentication using the given Username, e-mail, password and language.
   *
   * @param username - the chosen username
   * @param email - the authentication's e-mail address
   * @param password - the new authentication's chosen password. Must fulfill the set password conditions
   * @param locale - the chosen language locale
   * @param attributes - custom attributes to add (if any)
   */
  async signup(
    username: string,
    email: string,
    password: string,
    locale?: string,
    attributes?: Record<string, string>
  ): Promise<void> {
    const signUpResult: ISignUpResult = await new Promise((resolve, reject) => {
      const userAttributes = [];

      // Add e-mail to attributes
      userAttributes.push(
        new AmazonCognitoIdentity.CognitoUserAttribute({
          Name: 'email',
          Value: email,
        })
      );

      // Handle custom attributes
      if (attributes) {
        Object.keys(attributes).forEach((attributeKey) => {
          userAttributes.push(
            new AmazonCognitoIdentity.CognitoUserAttribute({
              Name: attributeKey,
              Value: attributes[attributeKey],
            })
          );
        });
      }

      // Trigger signup
      this.$authStore.userPool?.signUp(
        username,
        password,
        userAttributes,
        [],
        (err?: Error, result?: ISignUpResult) => {
          if (err) {
            this.$errorService.showErrorDialog(err);
            reject();
          }
          if (result) {
            resolve(result);
          }
        }
      );
    });

    this.$authStore.setCognitoUser(signUpResult.user);

    // Register in database TODO application specific: apply any other attributes here as well
    await signup(username, email, signUpResult.userSub, locale);
  }

  /**
   * Logs out the currently logged in authentication (if any)
   */
  async logout(): Promise<void> {
    // Deep copy to avoid mutating store state
    const cognitoUser: CognitoUser | undefined = cloneDeep(
      this.$authStore.cognitoUser
    );

    if (!cognitoUser) {
      this.$errorService.showErrorDialog(
        new Error(i18n.global.t('errors.not_logged_in'))
      );
    } else {
      // Sign out
      await new Promise<void>((resolve) => {
        cognitoUser.signOut(() => {
          this.$authStore.setCognitoUser(undefined);
          this.$authStore.setUserSession(undefined);
          localStorage.clear(); // Needed to remove session,id,... tokens
          resolve();
        });
      });

      // Redirect to login
      await this.$routerService.routeTo(ROUTES.LOGIN);

      // Clear cache to prevent erroneous loading when changing roles
      const apolloClient = useApolloClient();
      await apolloClient.client.clearStore();
    }
  }

  /**
   * Shows a dialog for changing password
   */
  showChangePasswordDialog(): void {
    this.$q
      .dialog({
        component: ChangePasswordDialog,
        componentProps: {},
      })
      .onOk(
        ({
          passwordNew,
          passwordOld,
        }: {
          passwordNew: string;
          passwordOld: string;
        }) => {
          this.$authStore.cognitoUser?.changePassword(
            passwordOld,
            passwordNew,
            (err: Error | undefined) => {
              if (err) {
                this.$errorService.showErrorDialog(err);
              }
            }
          );
        }
      );
  }

  /**
   * Shows a dialog for requesting password reset
   */
  showResetPasswordDialog(): void {
    const { userPool } = this.$authStore;

    if (userPool === undefined) {
      this.$errorService.showErrorDialog(new Error(userNotDefinedError));
      return;
    }

    this.$q
      .dialog({
        component: ForgotPasswordDialog,
      })
      .onOk((username: string) => {
        // Set up cognitoUser first
        this.$authStore.setCognitoUser(
          new CognitoUser({
            Username: username,
            Pool: userPool,
          })
        );

        // Call forgotPassword on cognitoUser
        this.$authStore.cognitoUser?.forgotPassword({
          onSuccess() {
            // Do nothing
          },
          onFailure: (err: Error) => {
            this.$authStore.setCognitoUser(undefined);
            this.onFailure(err);
          },
          inputVerificationCode: () => {
            this.showResetPasswordFormDialog();
          },
        });
      });
  }

  /**
   * Show actual password reset formPages dialog
   */
  showResetPasswordFormDialog(): void {
    this.$q
      .dialog({
        component: ResetPasswordDialog,
      })
      .onOk(
        ({
          verificationCode,
          newPassword,
        }: {
          verificationCode: string;
          newPassword: string;
        }) => {
          this.$authStore.cognitoUser?.confirmPassword(
            verificationCode,
            newPassword,
            {
              onSuccess: () => {
                showSuccessNotification(
                  this.$q,
                  i18n.global.t('messages.password_changed')
                );
              },
              onFailure: (err: Error) => {
                this.$errorService.showErrorDialog(err);
              },
            }
          );
        }
      );
  }

  /**
   * Shows a dialog for requesting password reset. The verification code is sent to the given e-mail address
   * @param username - the username of the logged-in user
   * @returns void
   */
  showRequestNewPasswordDialog(username: string): void {
    const { userPool } = this.$authStore;

    if (userPool === undefined) {
      this.$errorService.showErrorDialog(new Error(userNotDefinedError));
      return;
    }

    this.$authStore.setCognitoUser(
      new CognitoUser({
        Username: username,
        Pool: userPool,
      })
    );

    // Call forgotPassword on cognitoUser
    this.$authStore.cognitoUser?.forgotPassword({
      onSuccess() {
        // Do nothing
      },
      onFailure: (err: Error) => {
        this.$authStore.setCognitoUser(undefined);
        this.onFailure(err);
      },
      inputVerificationCode: () => {
        this.showResetPasswordFormDialog();
      },
    });
  }

  /**
   * Resends the e-mail configuration code for the current user
   */
  async resendEmailVerificationCode(): Promise<void> {
    await new Promise((resolve, reject) => {
      this.$authStore.cognitoUser?.resendConfirmationCode((err) => {
        if (!err) {
          resolve(null);
        }
        reject();
      });
    });
  }

  /**
   * Shows a dialog for verifying E-Mail
   */
  async showEmailVerificationDialog(): Promise<void> {
    await new Promise((resolve, reject) => {
      this.$q
        .dialog({
          component: EmailConfirmationDialog,
          componentProps: {
            q: this.$q,
            authService: this,
          },
        })
        .onOk(({ code }: { code: string }) => {
          this.$authStore.cognitoUser?.confirmRegistration(
            code,
            true,
            (err, result) => {
              if (!err) {
                resolve(result);
              }
              reject();
            }
          );
        });
    });
  }

  /**
   * Shows a dialog containing a QR code for setting up two factor authentication
   *
   * @param secretCode - the authenticator code to encode in QR code formPages
   * @param cognitoUser - the cognito user to show the dialog for
   * @param identifier - identifier (username of email)
   * @returns void
   */
  showQRCodeDialog(
    secretCode: string,
    cognitoUser: CognitoUser,
    identifier: string
  ): Promise<void> {
    return new Promise((resolve) => {
      const codeUrl = `otpauth://totp/${this.appName} (${identifier})?secret=${secretCode}&Issuer=${this.appName}`;
      this.$q
        .dialog({
          component: QrCodeDialog,
          componentProps: {
            value: codeUrl,
          },
        })
        .onOk(() => {
          // Verify code
          this.$q
            .dialog({
              component: MFADialog,
            })
            .onOk((code: string) => {
              cognitoUser.verifySoftwareToken(code, 'TOTP Device', {
                onSuccess: (userSession: CognitoUserSession) => {
                  void this.loginSuccess(userSession);
                  resolve();
                },
                onFailure: (error: Error) => {
                  this.onFailure(error);
                },
              });
            });
        });
    });
  }

  /**
   * Confirm e-mail verification code
   *
   * @param code -verification code
   */
  async verifyEmail(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$authStore.cognitoUser?.confirmRegistration(
        code,
        true,
        (err: Error) => {
          if (err) {
            console.error(err);
            reject();
          }
          resolve();
        }
      );
    });
  }

  /**
   * Verifies a given 2FA code
   *
   * @param tokenType - the type of token to verify
   * @param resolve - resolve function
   */
  verify2FACode(
    tokenType: string,
    resolve: (value: void | PromiseLike<void>) => void
  ): void {
    // Verify code
    this.$q
      .dialog({
        component: MFADialog,
      })
      .onOk((code: string) => {
        // Deep copy user so state object does not get altered
        const currentUser: CognitoUser | undefined = cloneDeep(
          this.$authStore.cognitoUser
        );
        currentUser?.sendMFACode(
          code,
          {
            onSuccess: (userSession: CognitoUserSession) => {
              this.$authStore.setCognitoUser(currentUser);
              void this.loginSuccess(userSession);
              resolve();
            },
            onFailure: (error: Error) => {
              this.onFailure(error);
            },
          },
          tokenType
        );
      });
  }

  /**
   * When login succeeds
   *
   * @param userSession - the currently active Cognito authentication session
   */
  async loginSuccess(userSession: CognitoUserSession): Promise<void> {
    // Store locally
    this.$authStore.setUserSession(userSession);

    // Redirect to main page TODO application specific: choose correct route
    await this.$routerService?.routeTo(ROUTES.HOME);
  }

  /**
   * When any operation (mostly login) fails, verify whether it is due to the authentication not having verified their account
   *
   * @param error - the error that caused the failure
   * @param identifier - the authentication's identifier (usually E-mail or username) for re-login
   * @param password - the authentication's password for re-login
   */
  onFailure(error: Error, identifier?: string, password?: string): void {
    let message;

    switch (error.name) {
      // Case 1: User has not verified their e-mail yet
      case 'UserNotConfirmedException':
        void this.showEmailVerificationDialog().then(() => {
          if (identifier && password) {
            // Retry login
            void this.login(identifier, password, this.$q);
          }
        });
        break;
      // Case 2: User must reset password (e.g. if forced via AWS console)
      case 'PasswordResetRequiredException':
        // Call forgotPassword on cognitoUser, since user must reset password
        this.$authStore.cognitoUser?.forgotPassword({
          onSuccess() {
            const $q = useQuasar();

            // Show success notification
            showSuccessNotification(
              $q,
              i18n.global.t('messages.password_changed')
            );
          },
          onFailure: (err: Error) => {
            this.$authStore.setCognitoUser(undefined);
            this.onFailure(err);
          },
          inputVerificationCode: () => {
            this.showResetPasswordFormDialog();
          },
        });
        break;
      // Case 3: Wrong password or user's Cognito account is disabled
      case 'NotAuthorizedException':
        if (error.message.includes('Incorrect username or password')) {
          // Wrong username / password
          message = i18n.global.t('errors.incorrect_username_or_password');
        } else if (error.message.includes('User is disabled')) {
          // Account disabled
          message = i18n.global.t('errors.account_disabled');
        } else if (
          error.message.includes(
            'User password cannot be reset in the current state'
          )
        ) {
          // Password can't be reset
          message = i18n.global.t('errors.cannot_reset_password');
        }

        // Other NotAuthorizedExceptions are handled directly
        this.$errorService.showErrorDialog(
          message ? new Error(message) : error
        );
        break;
      // Default: any other error
      default:
        this.$errorService.showErrorDialog(error);
        break;
    }
  }

  /**
   * Refreshes the idToken if necessary
   *
   * @returns void
   */
  refreshToken(): Promise<void> {
    return new Promise((resolve, reject) => {
      const { userSession } = this.$authStore;
      const idTokenExpiration = userSession?.getIdToken().getExpiration();
      if (!idTokenExpiration) {
        resolve();
      }
      const refreshToken = userSession?.getRefreshToken();
      if (
        refreshToken &&
        idTokenExpiration &&
        idTokenExpiration - Date.now() / 1000 < 45 * 60
      ) {
        // 15min before de-validation token is refreshed
        const currentUser: CognitoUser | undefined = cloneDeep(
          this.$authStore.cognitoUser
        ); // refresh session mutates the state of store: illegal
        currentUser?.refreshSession(refreshToken, (err, session) => {
          if (session) {
            this.$authStore.setCognitoUser(currentUser);
            this.$authStore.setUserSession(
              session as CognitoUserSession | undefined
            );
            resolve();
          } else {
            reject(err);
          }
        });
      } else {
        resolve();
      }
    });
  }
}
