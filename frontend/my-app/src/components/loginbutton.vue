<template>
<q-btn
    label="Login"
    @click="login"
/>
</template>

<script setup lang="ts">
// import entire SDK
import AWS from 'aws-sdk';


AWS.config.region = 'eu-central-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'eu-central-1:9741d3b0-b772-4c4d-903a-923641020b19',
});

function login(){
  AWS.config.credentials.get(err => console.log(err));
}
</script>

<style scoped>

</style>
