import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {CognitoAccessToken, CognitoIdToken, CognitoRefreshToken} from "amazon-cognito-auth-js";
import {CognitoUser} from "amazon-cognito-identity-js";

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
    }

    /**
     * Logs into the AWS user pool using the given data
     * @param identifier {string} - the user's identifier (usually E-mail or username)
     * @param password {string} - the user's password
     */
    login(identifier: string, password: string, ){

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
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: this.authSuccess,
            onFailure: function (err: any){
                console.log(err) // TODO @thommann
            },
            mfaSetup: function (){
                console.log("Set up MFA!")
                // @ts-ignore
                cognitoUser.associateSoftwareToken(this)
            },

            selectMFAType: function(challengeName, challengeParameters) {
                console.log("Select MFA type!")
                cognitoUser.sendMFASelectionAnswer("SOFTWARE_TOKEN_MFA", this);
            },

            // Function that is called if time-limited one time password is required
            totpRequired: function(tokenType) {
                console.log(tokenType)
                // TODO dialog
                const challengeAnswer = prompt('Please input the TOTP code and random garbage.', '');
                if (typeof challengeAnswer === "string") {
                    cognitoUser.sendMFACode(challengeAnswer, this, tokenType);
                }
            },

            mfaRequired: function(codeDeliveryDetails) {
                const verificationCode = prompt('Please input verification code', '');
                if (typeof verificationCode === "string") {
                    cognitoUser.sendMFACode(verificationCode, this);
                }
            },

            // @ts-ignore
            associateSecretCode: function(secretCode) {
                console.log("issa secret", secretCode)
                const challengeAnswer = prompt('Please input the TOTP code.', '');
                if (typeof challengeAnswer === "string") {
                    cognitoUser.verifySoftwareToken(challengeAnswer, 'My TOTP device', this);
                }
            },

        })
    }

    /**
     * TODO
     * @param username
     * @param email
     * @param password
     */
    signUp(username: string, email: string, password: string) {
        return new Promise((resolve, reject)=>{
            const attributes = [];
            attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "email", Value: email}))
            // TODO disable requirement on AWS @thommann
            attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "birthdate", Value: "2000-05-12"}))
            console.log("userpool:", this.userPool)
            //@ts-ignore
            this.userPool.signUp(username, password, attributes, [], (err: Error, result: object)=>{
                if(err) {
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
            this.user.user.confirmRegistration(code, true, (err, result)=>{
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

        // TODO test
        this.cognitoUser = result.user
    }
}
