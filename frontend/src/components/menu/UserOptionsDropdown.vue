<template>
  <!-- Options for enabled users -->
  <q-btn-dropdown
    v-if="!user.banned_at"
    dropdown-icon="more_vert"
    auto-close
    no-icon-animation
    flat
    round
    dense
    @click.stop="showOptions = !showOptions"
  >
    <div class="column">
      <!-- 'Disable' button for active accounts -->
      <q-btn
        :label="$t('admin.disable_account')"
        icon="block"
        class="text-black"
        flat
        no-caps
        @click="() => disableUser(user, role, $q)"
      />
    </div>
  </q-btn-dropdown>
  <!-- Disabled icon for disabled users -->
  <q-icon
    v-else
    color="negative"
    name="block"
    size="sm"
  />
</template>

<script setup lang="ts">
/**
 * This is a dropdown options component to be used in all user tables
 * currently, it only serves to disable users
 */

import {disableUser} from 'src/helpers/admin-helpers';
import {useQuasar} from 'quasar';
import {PropType} from 'vue';
import {ROLE} from 'src/data/ENUM/ENUM';

const $q = useQuasar()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  role: {
    type: String as PropType<ROLE>,
    required: true
  }
})
</script>
