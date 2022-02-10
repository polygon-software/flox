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
        <!-- Warning card for companies -->
        <q-card
          v-if="role === ROLE.COMPANY"
          class="row q-pa-md text-white bg-red-5 justify-between items-center"
        >
          <q-icon
            class="col-3"
            name="warning"
            color="white"
            size="40px"
          />
          <strong class="col">
            {{ $t('admin.disable_company_account_description') }}
          </strong>
        </q-card>
      </q-card-section>
      <q-card-section>
        <q-list
          bordered
          separator
        >
          <q-item>
            <q-item-section>
              <div class="row flex content-center" style="height: 24px">
                <p class="col-5">{{ $t('account_data.first_name') }}:</p>
                <p class="col-7">{{ props.user.first_name }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row flex content-center" style="height: 24px">
                <p class="col-5">{{ $t('account_data.last_name') }}:</p>
                <p class="col-7">{{ props.user.last_name }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row flex content-center" style="height: 24px">
                <p class="col-5">{{ $t('account_data.email') }}:</p>
                <p class="col-7">{{ props.user.email }}</p>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row flex content-center" style="height: 24px">
                <p class="col-5">{{ $t('account_data.phone_number') }}:</p>
                <p class="col-7">{{ props.user.phone }}</p>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('admin.disable_account')"
          color="negative"
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
import {ROLE} from 'src/data/ENUM/ENUM';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const $q: QVueGlobals = useQuasar()
const emit = defineEmits(['ok'])

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  },
  role: {
    type: String as PropType<ROLE>,
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

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}

</script>
