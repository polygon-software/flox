import {computed, Ref, ref} from 'vue';
import {CognitoUser, CognitoUserSession} from 'amazon-cognito-identity-js';


// Type definition of state
type State = Ref<{
    authentication: {
        userSession?: CognitoUserSession,
        cognitoUser?: CognitoUser
    }
}>


// Store state - not publicly available, only accessed via getters/setters
const state: State = ref({
    authentication: {
        userSession: undefined,
        cognitoUser: undefined,
    }
})

/**
 * User/Login status functionalities
 */

// Getters
const getLoggedInStatus = computed(() => {
    return state.value.authentication.userSession?.isValid() ?? false
})
const getUsername = computed(() => {
    return state.value.authentication.cognitoUser?.getUsername()?? null
})
const getCognitoUser = computed(() => state.value.authentication.cognitoUser)
const getUserSession = computed(() => state.value.authentication.userSession)

// Setters
function setUserSession(value?: CognitoUserSession){
    state.value.authentication.userSession = value
}
function setCognitoUser(value?: CognitoUser){
    state.value.authentication.cognitoUser = value
}



// Exports
export {
    getLoggedInStatus,
    getUsername,
    getCognitoUser,
    getUserSession,
    setUserSession,
    setCognitoUser
}
