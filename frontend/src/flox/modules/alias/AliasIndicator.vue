<template>
  <Teleport to="body">
    <div
      v-if="isAliasSet"
      class="alias row items-center justify-between shadow-6 rounded-borders"
    >
      <p>{{ $t('alias.active') }}</p>
      <q-btn
        outline
        no-caps
        icon-right="visibility_off"
        color="primary"
        :label="$t('general.remove')"
        @click="removeAlias"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';

import {
  getAlias,
  unsetAlias,
} from 'src/flox/modules/alias/services/alias.service';

const isAliasSet: ComputedRef<boolean> = computed(() => {
  return !!getAlias();
});

/**
 * Removes alias and reloads window
 */
function removeAlias(): void {
  unsetAlias();
  location.reload();
}
</script>

<style scoped lang="scss">
.alias {
  position: fixed;
  height: 50px;
  width: 220px;
  bottom: 75px;
  right: -160px;
  z-index: 100000;
  transition: 0.5s;
  padding-right: 30px;
  border: 1px solid $primary;

  p {
    color: $primary;
    margin: 0;
    padding: 4px;
    font-weight: 600;
    text-align: center;
    width: 55px;
  }
}
.alias:hover {
  right: -20px;
  transition: 0.5s;
}
</style>
