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
        <q-list
          bordered
          separator
        >
          <q-item>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.username') }}:</p>
                <p class="col-7">{{ props.user.username }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.full_name') }}:</p>
                <p class="col-7">{{ props.user.fullName }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.address') }}:</p>
                <p class="col-7">{{ address.prettyString() }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.phone_number') }}:</p>
                <p class="col-7">{{ props.user.phone }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.email') }}:</p>
                <p class="col-7">
                  {{ props.user.email }}
                </p>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row flex content-center">
                <p class="col-5">{{ $t('account_data.birthdate') }}:</p>
                <p class="col-7">
                  {{ formatDate(props.user.birthdate) }}
                </p>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
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
import {Address} from 'src/data/types/Address';
import {User} from 'src/data/types/User';
import {formatDate} from 'src/helpers/format-helpers';

const $q: QVueGlobals = useQuasar()
const emit = defineEmits(['ok'])

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  },
})

const address = new Address(
  props.user.address?.street?? undefined,
  props.user.address?.number ?? undefined,
  props.user.address?.city ?? undefined,
  props.user.address?.zipCode ?? undefined,
)

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
 * Executed upon rejecting a company application
 * @returns {void}
 */
function onReject(): void {
  // TODO
}

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}

</script>
