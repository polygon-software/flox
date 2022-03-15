<template>
  <q-dialog
    ref="dialogRef"
    :no-backdrop-dismiss="true"
  >
    <q-card class="q-pa-sm" style="width: 600px; min-height: 250px">
      <h5 style="text-align: center">{{ $t('edit_parameters.copy_contact') }}</h5>

      <div
        v-for="contact in contacts"
        :key="contact.id"
      >
        {{ contact.name }}
      </div>

      <q-card-actions align="center">
        <q-btn
          :label="$t('buttons.confirm')"
          outline
          class="text-grey"
          @click="() => onDialogOK()"
        />
        <q-btn
          :label="$t('buttons.cancel')"
          outline
          class="text-grey"
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import {myContacts} from 'src/helpers/api-helpers';

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const contacts = myContacts()
// const selectedContact: Ref<DeviceContact|null> = ref(null)
</script>
