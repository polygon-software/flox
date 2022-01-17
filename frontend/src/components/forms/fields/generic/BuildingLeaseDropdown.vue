<template>
  <div class="row q-mb-md">
    <strong class="col q-py-sm">{{ $t('form_for_clients.building_lease') }}</strong>
    <q-option-group
      class="col"
      v-model="selectedOption"
      :options="options"
      type="radio"
      inline
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
        class="col"
        v-model="landlord"
        :options="landlordOptions"
        type="radio"
        inline
      />
      <warning-dialog
        v-model="privateLandlord"
        :description="$t('form_for_clients.landlord_warning')">
      </warning-dialog>
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
import WarningDialog from "components/dialogs/WarningDialog.vue";

const emit = defineEmits(['change'])

const options = [
  {label: i18n.global.t('general.yes'), value: true},
  {label: i18n.global.t('general.no'), value: false},
]

const landlordOptions = [
  {label: i18n.global.t('form_for_clients.public'), value: true},
  {label: i18n.global.t('form_for_clients.private'), value: false},
]

const selectedOption = ref(options[0].value)
const landlord = ref(landlordOptions[0].value)
const privateLandlord = ref(landlord)
const date = ref(new Date())
const price = ref('')


/**
 * Emits the updated value, if it is valid
 *       label: i18n.global.t('form_for_clients.owner_occupied'),
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
