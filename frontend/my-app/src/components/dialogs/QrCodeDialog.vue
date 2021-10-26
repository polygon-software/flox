<template>
  <q-dialog
      ref="dialog"
      :persistent="true"
      title="QR"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 300px">
      <q-card-section class="flex flex-center column">
        <h5 class="q-ma-sm">Set up 2FA</h5>
        <p class="text-grey-8">
          TODO a description of authenticator setup will go here. Lorem ipsum dolor sit amet bla
        </p>
        <qrcode-vue
            :value="props.value"
            :size="180"
        />
      </q-card-section>
      <q-separator dark/>
      <q-card-actions align="right">
        <q-btn
            label="Abbrechen"
            color="primary"
            @click="hide"
        />
        <q-btn
            label="OK"
            color="primary"
            @click="onOk"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import QrcodeVue from 'qrcode.vue';
  import {defineProps, defineEmits, ref} from 'vue';

  let dialog = ref(null)

  const props = defineProps({
    value: String
  })

  const emit = defineEmits(['ok'])

  function hide(){
    dialog.value?.hide()
  }

  function onOk(){
    emit('ok')
    hide()
  }

</script>
