import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {CognitoUserAttribute} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "eu-central-1_DGPNZZeuX",
    ClientId: "***REMOVED***"
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)

function login(email: string, password: string, confirm_mfa: boolean, mfa: Function){
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password
    });
    const userData = {
        Username: email,
        Pool: userPool,
    }
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result: any){
            console.log("access Token: " + result.getAccessToken().getJwtToken())
            console.log("id Token: " + result.getIdToken().getJwtToken())
            console.log("refresh Token: " + result.getRefreshToken())
        },
        onFailure: function (err: any){
            console.log(err)
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

        totpRequired: function(secretCode) {
            const challengeAnswer = prompt('Please input the TOTP code and random garbage.', '');
            if (typeof challengeAnswer === "string") {
                cognitoUser.sendMFACode(challengeAnswer, this, 'SOFTWARE_TOKEN_MFA');
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

function signUp(username: string, email: string, password: string) {
    return new Promise((resolve, reject)=>{
        const attributes = [];
        attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "email", Value: email}))
        attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "birthdate", Value: "2000-05-12"}))
        // @ts-ignore
        userPool.signUp(username, password, attributes, [], (err: Error, result: object)=>{
            if(err) {
                console.log("blubb", err)
                reject();
            }
            resolve(result);
        })
    })

}

function confirm(code: string, user: AmazonCognitoIdentity.CognitoUser){
    console.log(typeof user)
    console.log(user)
    return new Promise((resolve, reject)=>{
        // @ts-ignore
        user.user.confirmRegistration(code, true, (err, result)=>{
            if(err){
                console.error(err)
                reject()
            }
            resolve(result)
        })
    })
}
export {login, signUp, confirm}
