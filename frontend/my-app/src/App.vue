<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
})
// import {AuthenticationService} from './services/AuthService';
// import {provide, ref} from 'vue';
// import {ErrorService} from './services/ErrorService';
// import {useQuasar} from 'quasar';
//
// const $q = useQuasar()
//
// // Error service
// const $errorService = ref(new ErrorService($q))
// provide('$errorService', $errorService)
//
// // Auth service
// const $authService = ref(new AuthenticationService($q, $errorService))
// provide<AuthenticationService>('$authService', $authService)
//
// // Quasar
// provide('$q', $q)

</script>
