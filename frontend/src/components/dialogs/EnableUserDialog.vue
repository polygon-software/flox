<template>
  <q-dialog
    ref="dialog"
    :title="$t('dashboards.application')"
  >
    <q-card style="width: 600px;">
      <q-card-section>
        <h5 class="q-ma-none q-pa-none">
          {{ $t('admin.enable_account') }}
        </h5>
      </q-card-section>

      <q-card-section>
        <user-details :user="props.user"/>
      </q-card-section>

      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('admin.enable_account')"
          color="positive"
          @click="onOk"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('admin.reject_application')"
          color="negative"
          @click="onReject"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('buttons.cancel')"
          color="primary"
          flat
          @click="onCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {defineProps, defineEmits, ref, Ref, PropType} from 'vue'
import {QDialog, QVueGlobals, useQuasar} from 'quasar';
import {User} from 'src/data/types/User';
import {showNotification} from 'src/helpers/notification-helpers';
import {i18n} from 'boot/i18n';
import UserDetails from 'components/user/UserDetails.vue';

const $q: QVueGlobals = useQuasar()
const emit = defineEmits(['ok'])

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  },
})

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}

// eslint-disable-next-line require-jsdoc
function hide(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

/**
 * On OK, emit event
 * @returns {void}
 */
function onOk(): void{
  emit('ok')
  hide()
}

/**
 * Executed upon rejecting a user application
 * @returns {void}
 */
function onReject(): void {
  // TODO actually reject application
  hide()

  // Show reject confirmation prompt
  showNotification(
    $q,
    i18n.global.t('messages.account_rejected'),
    undefined,
    'negative'
  )
}

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}

</script>
