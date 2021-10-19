<template>
  <q-dialog
      ref="dialog"
      @ok="onOk"
      :persistent="true"
      title="Blubb"
  >
    <q-card class="q-pa-md flex flex-center column" style="min-width: 300px; min-height: 300px">
      <h5 class="q-ma-sm">Set up 2FA</h5>
      <qrcode-vue
          :value="props.value"
          :size="180"
      />
      <q-btn
          class="q-ma-md"
          label="OK"
          color="primary"
          @click="onOk"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import QrcodeVue from "qrcode.vue";
  import {defineProps, ref} from "vue";

  let dialog = ref(null)

  const props = defineProps({
    value: String
  })

  // eslint-disable-next-line no-unused-vars
  function show(){
    dialog.value.show()
  }

  // eslint-disable-next-line no-unused-vars
  function hide(){
    dialog.value.hide()
  }

  function onOk(){
    hide()
  }

</script>

<style scoped>

</style>
