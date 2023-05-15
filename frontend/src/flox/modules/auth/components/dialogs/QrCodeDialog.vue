<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-pa-sm text-center" style="width: 400px; min-height: 300px">
      <q-card-section class="flex flex-center column">
        <h5 class="q-ma-sm">
          {{ $t('authentication.set_up_2fa') }}
        </h5>
        <p class="text-grey-8">
          {{ $t('authentication.set_up_2fa_description') }}
        </p>
        <QrcodeVue :value="value" :size="180" />
      </q-card-section>
      <q-separator dark />
      <q-card-actions align="center">
        <q-btn
          :label="$t('general.cancel')"
          color="primary"
          flat
          @click="onDialogHide"
        />
        <q-btn :label="$t('general.ok')" color="primary" @click="onDialogOK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';
import { useDialogPluginComponent } from 'quasar';

const props = defineProps<{
  value: string;
}>();

// eslint-disable-next-line vue/define-emits-declaration
defineEmits(useDialogPluginComponent.emits);

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();
</script>
