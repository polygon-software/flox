<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin q-pa-sm"
      style="width: 800px;"
      flat
      square
    >
      <q-card-section class="column items-center">
        <!-- Title -->
        <h6 class="q-ma-none q-pa-none">
          {{$t('projects.new_project')}}
        </h6>

        <!-- Project name -->
        <q-input
          v-model="newName"
          :label="$t('projects.edit_project_name')"
          class="q-ma-md"
          outlined
          dense
        />

      </q-card-section>

      <!-- Devices -->

      <q-card-actions
        align="center"
      >
        <!-- Create button -->
        <q-btn
          :label="$t('buttons.confirm')"
          style="border-radius: 0"
          text-color="primary"
          no-caps
          unelevated
          outline
          :disable="newName === name"
          @click="editProject"
        />

        <!-- Cancel button -->
        <q-btn
          :label="$t('buttons.cancel')"
          style="border-radius: 0; margin-left: 30px"
          text-color="primary"
          no-caps
          unelevated
          outline
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
// REQUIRED; must be called inside of setup()
import {useDialogPluginComponent} from 'quasar';
import {defineEmits, defineProps, Ref, ref} from 'vue';
import {UPDATE_PROJECT_NAME} from 'src/data/mutations/PROJECT';
import {executeMutation} from 'src/helpers/data-helpers';

const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(useDialogPluginComponent.emits)

const props = defineProps({
  uuid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
})

// Set initial value to original project name
const newName: Ref<string|null|undefined> = ref(props.name)

/**
 * Updates the project's name
 * @return {void}
 */
async function editProject() {
  let mutationResult

  mutationResult = await executeMutation(
    UPDATE_PROJECT_NAME,
    {
      uuid: props.uuid,
      name: newName.value,
    }
  )

  if (!mutationResult) {
    throw new Error('An error occurred while creating the project')
  }
 onDialogOK(newName.value)
}
</script>
