<template>
  <q-dialog
      ref="dialog"
      :persistent="true"
      title="QR"
      @hide="hide"
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
            :label="$t('buttons.cancel')"
            color="primary"
            @click="hide"
        />
        <q-btn
          :label="$t('buttons.ok')"
            color="primary"
            @click="hide"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';
import {defineProps, ref, Ref} from 'vue';
import {QDialog, useDialogPluginComponent} from 'quasar'


const dialog: Ref<QDialog|null> = ref(null)
// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void{
  //eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function hide(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

const props = defineProps({
  value: String
})

</script>
