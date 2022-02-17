<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card v-if="user" class="q-dialog-plugin q-pa-md" style="width: 800px;">

      <q-card-section>
        <user-details :user="user"/>
      </q-card-section>

      <q-card-actions align="between">
        <!-- Back -->
        <q-btn
          :label="$t('buttons.back')"
          color="black"
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { QDialog, useDialogPluginComponent } from 'quasar';
import { fetchUser } from 'src/helpers/api-helpers';
import UserDetails from 'components/user/UserDetails.vue';


// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  userId: {
      required: true,
      type: String,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(useDialogPluginComponent.emits)

const user = fetchUser(props.userId)
</script>
