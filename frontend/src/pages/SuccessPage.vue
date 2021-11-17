<template>
  <h2>Registrierung bestätigt</h2>
  <h4>Deine Registrierung wird nun bearbeitet! Du wirst nun automatisch zum Login-Screen zurückgeleitet.</h4>
  <q-icon name="done" size="300px" color="green" class="absolute-center"/>

  <q-btn
    v-if="!startSignup"
    color="primary"
    label="zurück zu login"
    type="submit"
  />
</template>

<script>
export default {
  name: 'SuccessPage'
}
</script>

<style scoped>

</style>
