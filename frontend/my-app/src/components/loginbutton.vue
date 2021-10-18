<template>
  <q-btn
      label="SignUp"
      @click="confirm_modal = true"
  />
  <q-dialog v-model="confirm_modal">
    <q-card>
      <q-card-section>
        <q-input v-model="email"/>
        <q-input v-model="password"/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Register" v-close-popup @click="signUp"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
var AmazonCognitoIdentity = require('amazon-cognito-identity-js')
import {ref} from "vue";

const poolData = {
  UserPoolId: "eu-central-1_DGPNZZeuX",
  ClientId: "48k1t49g64el9v2m0ojv5dh0p7"
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
let user;

let confirm_modal = ref(false);
let email = ref("")
let password = ref("")


// eslint-disable-next-line no-unused-vars
function login(email, password){
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
    onSuccess: function (result){
      console.log("access Token: " + result.getAccessToken().getJwtToken())
      console.log("id Token: " + result.getIdToken().getJwtToken())
      console.log("refresh Token: " + result.getRefreshToken().getJwtToken())
    },
    onFailure: function (err){
      console.log(err)
    }
  })
}
function signUp() {
  userPool.signUp(email, password,signUp, null, null, (err, result)=>{
    if(err) {
      console.log(err)
    }
    user = result.usage;
    console.log(user.username)
  })
}
</script>

<style scoped>

</style>
