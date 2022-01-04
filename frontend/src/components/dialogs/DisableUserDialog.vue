<template>
  <q-dialog
    ref="dialog"
    :title="$t('dashboards.application')"
  >
    <q-card style="width: 600px;">
      <q-card-section>
        <h5 class="q-ma-none q-pa-none">
          {{ $t('admin.disable_account') }}
        </h5>
      </q-card-section>
      <q-card-section>
        <q-list
          bordered
          separator
        >
          <q-item>
            <q-item-section>
              <div class="row flex content-center" style="height: 24px">
                <p class="col-5">{{ $t('account_data.username') }}:</p>
                <p class="col-7">{{ props.user.username }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row flex content-center" style="height: 24px">
                <p class="col-5">{{ $t('account_data.full_name') }}:</p>
                <p class="col-7">{{ props.user.fullName }}</p>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <div class="column" style="margin-top: 10px">
          <!-- Permanent -->
          <q-radio
            v-model="permanent"
            :val="true"
            :label="$t('admin.permanent')"
            @click="untilDate = null"
          />

          <!-- Temporary: with datetime picker TODO use new DateTime picker once implemented -->
          <div class="row">
            <q-radio
              v-model="permanent"
              :val="false"
              :label="$t('admin.temporary')"
            />
            <q-input
              v-model="untilDate"
              type="date"
              outlined
              dense
              style="margin-left: 32px"
              @change="permanent = false"
            />
          </div>
        </div>

      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('admin.disable_account')"
          color="negative"
          :disable="!permanent && !untilDate"
          @click="onOk"
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

const $q: QVueGlobals = useQuasar()
const emit = defineEmits(['ok'])

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

// Permanent/Temporary toggle
const permanent = ref(true)

// End date (if any)
const untilDate: Ref<Date|null> = ref(null)

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
  // Emit with duration (if applicable)
  if(permanent.value){
    emit('ok')
  } else {
    emit('ok', untilDate.value)
  }
  hide()
}

/**
 * Executed upon rejecting a company application
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
