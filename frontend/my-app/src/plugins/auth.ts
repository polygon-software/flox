const AmazonCognitoIdentity = require('amazon-cognito-identity-js')

const poolData = {
    UserPoolId: "eu-central-1_DGPNZZeuX",
    ClientId: "***REMOVED***"
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)

function login(email: string, password: string){
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
        }
    })
}
function signUp(email: string, password: string) {
    return new Promise((resolve, reject)=>{
        userPool.signUp(email, password, null, null, (err: Error, result: object)=>{
            if(err) {
                reject();
            }
            resolve(result);
        })
    })

}
export {login, signUp}
