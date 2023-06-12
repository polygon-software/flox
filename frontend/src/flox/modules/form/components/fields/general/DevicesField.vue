<template>
  <div v-for="(device, deviceIndex) in fieldValue" :key="deviceIndex">
    <div style="text-align: center" class="q-mb-md q-mt-lg">
      {{ i18n.global.t('fields.device') + ' ' + (deviceIndex + 1).toString() }}
    </div>
    <div class="row">
      <GenericSelectField
        :initial-value="fieldValue[deviceIndex].deviceType"
        :options="translatedObjects(DEVICE_TYPE, 'device_type')"
        :rules="[]"
        :label="i18n.global.t('fields.device_type')"
        @change="(newValue) => (fieldValue[deviceIndex].deviceType = newValue)"
      />
      <GenericInputField
        :initial-value="fieldValue[deviceIndex].deviceManufacturer"
        :rules="[]"
        :label="i18n.global.t('fields.manufacturer')"
        @change="
          (newValue) =>
            (fieldValue[deviceIndex].deviceManufacturer = newValue?.toString())
        "
      />
    </div>
    <div class="row">
      <GenericInputField
        :initial-value="fieldValue[deviceIndex].deviceModel"
        :rules="[]"
        :label="i18n.global.t('fields.model')"
        @change="
          (newValue) =>
            (fieldValue[deviceIndex].deviceModel = newValue?.toString())
        "
      />
      <GenericInputField
        :initial-value="fieldValue[deviceIndex].deviceProductionNumber"
        :rules="[]"
        :label="i18n.global.t('fields.production_number')"
        @change="
          (newValue) =>
            (fieldValue[deviceIndex].deviceProductionNumber =
              newValue?.toString())
        "
      />
    </div>
    <GenericInputField
      :initial-value="fieldValue[deviceIndex].deviceProductionYear"
      :rules="[]"
      :label="i18n.global.t('fields.production_year')"
      type="number"
      @change="(newValue) => fieldValue[deviceIndex].deviceProductionYear = newValue as number"
    />
    <GenericInputField
      :initial-value="fieldValue[deviceIndex].deviceInformation"
      :rules="[]"
      :label="i18n.global.t('fields.information')"
      type="textarea"
      @change="
        (newValue) =>
          (fieldValue[deviceIndex].deviceInformation = newValue?.toString())
      "
    />

    <div class="row justify-around">
      <q-btn
        v-if="deviceIndex === fieldValue.length - 1"
        color="primary"
        :label="i18n.global.t('buttons.add_device')"
        unelevated
        icon="add"
        class="q-ma-md"
        @click="addDevice"
      />

      <q-btn
        :disable="fieldValue.length === 1"
        color="secondary"
        :label="i18n.global.t('buttons.remove_device')"
        unelevated
        icon="delete"
        class="q-ma-md"
        @click="removeDevice(deviceIndex)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Ref,
  ref,
  withDefaults,
  defineProps,
  computed,
  onBeforeMount,
  watch,
} from 'vue';

import { FormStateKey, useFormStore } from 'src/flox/modules/form/stores/form';
import { fetchByKey } from 'src/flox/modules/form/helpers/form-helpers';
import { FIELDS } from 'src/flox/modules/form/data/FIELDS';
import Device from 'src/flox/modules/form/data/types/Device';
import { DEVICE_TYPE } from 'src/data/ENUM';
import GenericSelectField from 'src/flox/modules/form/components/fields/general/GenericSelectField.vue';
import { i18n } from 'boot/i18n';
import GenericInputField from 'src/flox/modules/form/components/fields/general/GenericInputField.vue';

const props = withDefaults(
  defineProps<{
    // Used to fetch or store data from/to the store
    stateKey: FormStateKey;
  }>(),
  {}
);

const fieldValue: Ref<Device[]> = ref([new Device()]);

const store = useFormStore();

const fetchedDevices = computed(() => {
  return fetchByKey({
    formKey: props.stateKey?.formKey,
    pageKey: 'formData',
    cardKey: 'devices',
    fieldKey: FIELDS.DEVICES.key,
  }) as Device[] | null;
});

/**
 * Save the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (fieldValue.value && fieldValue.value.length > 0) {
    if (props.stateKey) {
      store.setValue(props.stateKey, fieldValue.value);
    }
  } else if (props.stateKey) {
    store.setValue(props.stateKey, null);
  }
}

/**
 * Returns an array of objects with value and label (translated)
 * @param enumObject - the enum object
 * @param translationKey - the translation key for the enum object (usually in the enum.ts file)
 * @return an array with label and value
 */
function translatedObjects(
  enumObject: Record<string, string>,
  translationKey: string
): { label: string; value: string }[] {
  return Object.keys(enumObject).map((key) => {
    const label = i18n.global.t(`enum.${translationKey}.${key}`);
    return {
      label,
      value: key,
    };
  });
}

/**
 * Deletes a device
 */
function removeDevice(index: number): void {
  fieldValue.value.splice(index, 1);
  saveValue();
}

/**
 * Adds a new device
 */
function addDevice(): void {
  fieldValue.value.push(new Device());
  saveValue();
}

/**
 *  Set article numbers in table when component is mounted
 *  @returns {void} - done
 */
onBeforeMount(() => {
  if (fetchedDevices.value && fetchedDevices.value.length > 0) {
    fieldValue.value = fetchedDevices.value;
  } else {
    fieldValue.value = [new Device()];
  }
});

/**
 * Save value on change
 */
watch(
  fieldValue,
  () => {
    saveValue();
  },
  { deep: true }
);
</script>
