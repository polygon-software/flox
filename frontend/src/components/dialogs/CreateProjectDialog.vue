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
          v-model="name"
          :label="$t('projects.project_name')"
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
          :label="$t('buttons.create_project')"
          style="border-radius: 0"
          text-color="primary"
          no-caps
          unelevated
          outline
          :disable="!name"
          @click="createProject"
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
import {defineEmits, defineProps, PropType, Ref, ref} from 'vue';
import {CREATE_PROJECT} from 'src/data/mutations/PROJECT';
import {executeMutation} from 'src/helpers/data-helpers';
import { loggedInUser } from 'src/helpers/api-helpers';
import {ErrorService} from 'src/services/ErrorService';

const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(useDialogPluginComponent.emits)

const props = defineProps({
  errorService: {
    type: Object as PropType<ErrorService>,
    required: true
  }
})

const name: Ref<string|null|undefined> = ref()

/**
 * Creates a new project.
 * @return {void}
 */
async function createProject() {
  const user = await loggedInUser()
  const userUuid = user?.uuid

  try{
    await executeMutation(
      CREATE_PROJECT,
      {
        userUuid: userUuid,
        name: name.value,
      }
    )
    onDialogOK()
  } catch (e){
    props.errorService?.showErrorDialog(e as Error)
  }
}
</script>
