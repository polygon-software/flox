<template>
  <Teleport to="body">
    <div class="alias flex">
      <p>{{ aliasName }}</p>
      <q-input v-model="newAlias" label="New Alias" />
      <q-btn label="Set Alias" @click="setNewAlias" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref, Ref } from 'vue';
import { Cookies } from 'quasar';

import {
  ALIAS_COOKIE_NAME,
  setAlias,
} from 'src/flox/modules/alias/services/alias.service';

const newAlias: Ref<string> = ref('');
const aliasName: ComputedRef<string> = computed(() => {
  return Cookies.get(ALIAS_COOKIE_NAME) || '';
});
function setNewAlias() {
  setAlias(newAlias.value);
}
</script>

<style scoped>
.alias {
  position: fixed;
  height: 50px;
  bottom: 0;
  left: 0;
  width: 100vw;
  z-index: 100000;
}
</style>
