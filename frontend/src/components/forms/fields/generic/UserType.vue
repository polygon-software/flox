<template>
  <div class="q-mb-md">
    <q-option-group
      v-model="selectedUser"
      :options="users"
      type="radio"
      align="left"
    />
  </div>
</template>

<script setup lang="ts">
import {i18n} from 'boot/i18n';
import {ref, watch, onMounted} from 'vue';

/**
 * This file is used for demo reasons, until automatic redirection is implemented.
 */

const emit = defineEmits(['change'])

const users = [
  {label: i18n.global.t('user_types.soi_admin'), value: 'admin-dashboard'},
  {label: i18n.global.t('user_types.manager'), value: 'management-dashboard'},
  {label: i18n.global.t('user_types.employee'), value: 'employee-dashboard'},
]
const selectedUser = ref(users[0].value)

watch(selectedUser, (newVal) => {
  emitValue(newVal)
})

/**
 * Emits the picked value
 * @param {string} newVal - chosen user type
 * @returns {void}
 */
function emitValue(newVal: string){
  emit('change', newVal)
}

onMounted(() => {
  emitValue(users[0].value)
})



</script>
