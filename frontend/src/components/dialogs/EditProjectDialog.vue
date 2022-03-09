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
          {{$t('projects.edit_project')}}
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

        <!-- Delete project button -->
        <q-btn
          :label="$t('buttons.delete_project')"
          style="border-radius: 0;"
          color="negative"
          no-caps
          unelevated
          outline
          @click="deleteProject"
        />

        <!-- Rename button -->
        <q-btn
          :label="$t('buttons.rename')"
          style="border-radius: 0; margin-left: 10px"
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
          text-color="primary"
          style="border-radius: 0"
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
import {QVueGlobals, useDialogPluginComponent} from 'quasar';
import {defineEmits, defineProps, PropType, Ref, ref} from 'vue';
import {DELETE_PROJECT, UPDATE_PROJECT_NAME} from 'src/data/mutations/PROJECT';
import {executeMutation} from 'src/helpers/data-helpers';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {i18n} from 'boot/i18n';
import {showNotification} from 'src/helpers/notification-helpers';
import {RouterService} from 'src/services/RouterService';

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
  q: {
    type: Object as PropType<QVueGlobals>,
    required: true
  },
  routerService: {
    type: Object as PropType<RouterService>,
    required: true
  }
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

/**
 * Shows a confirmation prompt and, upon confirmation, deletes a project
 * @return {void}
 */
function deleteProject() {
  props.q.dialog({
    component: WarningDialog,
    componentProps: {
      description: i18n.global.t('warnings.delete_project'),
      showDiscard: true,
      discardLabel: i18n.global.t('buttons.cancel'),
      swapNegative: true,
      okLabel: i18n.global.t('buttons.confirm')
    }
  }).onOk(async () => {
    // Delete project
    await executeMutation(DELETE_PROJECT, {uuid: props.uuid})

    // Show success notification
    showNotification(
      props.q,
      i18n.global.t('messages.project_deleted'),
      'bottom',
      'positive',
    )

    onDialogCancel()

    // Route back, since project no longer exists
    await props.routerService.goBack()
  })
}
</script>
