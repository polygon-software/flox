<template>
  <div class="row q-mb-md">
    <strong class="col q-py-sm">{{ $t('form_for_clients.building_lease') }}</strong>
    <q-option-group
      v-model="selectedOption"
      class="col"
      :options="options"
      type="radio"
      inline
      @update:model-value="emitValue"
    />
  </div>
  <div v-if="selectedOption">
    <q-input v-model="date" mask="date" :rules="['date']" :label="$t('form_for_clients.expiration_date')">
      <template #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date" @change="emitDate">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat/>
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <div class="row q-mb-md">
      <p class="col q-py-sm">{{ $t('form_for_clients.landlord') }}</p>
      <q-option-group
        v-model="landlord"
        class="col"
        :options="landlordOptions"
        type="radio"
        inline
        @update:model-value="landlordChange"
      />
    </div>
    <q-input
      v-model="price"
      dense
      type="text"
      :label="$t('form_for_clients.building_lease_interest')"
      :rules="[(val: string) => IS_VALID_STRING(val) || $t('errors.invalid_amount')]"
      @change="emitValuePrice"
    ></q-input>
  </div>
</template>

<script setup lang="ts">
import {i18n} from 'boot/i18n';
import {ref,} from 'vue';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {useQuasar} from 'quasar';

const emit = defineEmits(['change'])
const $q = useQuasar()

const options = [
  {label: i18n.global.t('general.yes'), value: true},
  {label: i18n.global.t('general.no'), value: false},
]

const landlordOptions = [
  {label: i18n.global.t('form_for_clients.public'), value: true},
  {label: i18n.global.t('form_for_clients.private'), value: false},
]

const selectedOption = ref(options[1].value)
const landlord = ref(landlordOptions[0].value)
const date = ref(new Date())
const price = ref('')


/**
 * A pop up opens  if the landlord is not public
 * @param {Boolean} isPublic - landlord type
 * @returns {void}
 */
function landlordChange(isPublic: boolean){
  if(!isPublic){
    $q.dialog({
      component: WarningDialog,
      componentProps: {description:  i18n.global.t('warnings.warning_landlord') }}
      )
  }
}

/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValue() {
  emit('change', selectedOption)
}


/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitDate() {
  emit('change', date)
}

/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValuePrice() {
  emit('change', price)
}
</script>
