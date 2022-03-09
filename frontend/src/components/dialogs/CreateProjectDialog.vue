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
import {defineEmits, Ref, ref} from 'vue';
import {CREATE_PROJECT} from 'src/data/mutations/PROJECT';
import {executeMutation} from 'src/helpers/data-helpers';
import {myUser} from 'src/helpers/api-helpers';

const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(useDialogPluginComponent.emits)

const name: Ref<string|null|undefined> = ref()
const mr2000instances = ref([])
const mr3000instances = ref([])

/**
 * Creates a new project.
 * @return {void}
 */
async function createProject() {
  const user = await myUser()
  const userUuid = user?.uuid

  const params = {
    userUuid: userUuid,
    name: name.value,
    mr2000instances: mr2000instances.value,
    mr3000instances: mr3000instances.value,
  }

  let mutationResult

  mutationResult = await executeMutation(
    CREATE_PROJECT,
    {
      createProjectInput: {
        ...params
      },
    }
  )

  if (!mutationResult) {
    throw new Error('An error occurred while creating the project')
  }
 onDialogOK()
}
</script>
