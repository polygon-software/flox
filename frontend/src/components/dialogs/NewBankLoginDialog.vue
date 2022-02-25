<template>
  <q-dialog
    ref="dialogRef"
    persistent
    :title="$t('bank.new_user')"
  >
    <q-card class="q-pa-md q-ma-md">
      <q-card-section>
        <p>{{$t('account_data.email')}}: {{props.email}}</p>
        <p>{{$t('account_data.password')}}: {{props.password}}</p>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('general.return')"
          color="positive"
          @click="onDialogOK"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {defineEmits} from 'vue'
import { useDialogPluginComponent } from 'quasar'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(useDialogPluginComponent.emits)

// REQUIRED; must be called inside of setup()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})
</script>

