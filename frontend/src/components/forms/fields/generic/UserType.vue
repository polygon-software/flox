<template>
  <div class="q-mb-md">
    <q-option-group
      v-model="selected_user"
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
const selected_user = ref(users[0].value)

watch(selected_user, (newVal) => {
  emitValue(newVal)
})

function emitValue(newVal: string){
  emit('change', newVal)
}

onMounted(() => {
  emitValue(users[0].value)
})



</script>
