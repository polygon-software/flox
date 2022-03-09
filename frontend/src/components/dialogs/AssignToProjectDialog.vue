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
          {{$t('projects.assign_to_project')}}
        </h6>

        <!-- Project picker -->
        <q-radio
          v-for="project in projects"
          :key="project.uuid"
          v-model="selectedProject"
          style="color: #87858A"
          :val="project"
          :label="project.name"
        />


      </q-card-section>

      <!-- Devices -->

      <q-card-actions
        align="center"
      >
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

        <!-- Confirm button -->
        <q-btn
          :label="$t('buttons.confirm')"
          style="border-radius: 0"
          text-color="primary"
          no-caps
          unelevated
          outline
          :disable="!selectedProject"
          @click="assignToProject"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
// REQUIRED; must be called inside of setup()
import {useDialogPluginComponent} from 'quasar';
import {defineEmits, onMounted, Ref, ref} from 'vue';
import {CREATE_PROJECT} from 'src/data/mutations/PROJECT';
import {executeMutation} from 'src/helpers/data-helpers';
import {myPoolDevices, myProjects, myUser} from 'src/helpers/api-helpers';
import {Project} from 'src/data/types/Project';

const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(useDialogPluginComponent.emits)

const projects: Ref<Project[]> = ref([])
const selectedProject: Ref<Project|null> = ref(null)

// Load user's projects
onMounted(async () => {
  projects.value = await myProjects()
  console.log('Got projects:', projects.value)
})

/**
 * TODO
 * @return {void}
 */
function assignToProject() {
  // TODO
  console.log('ASSIGN')
  // const user = await myUser()
  // const userUuid = user?.uuid
  //
  // const params = {
  //   userUuid: userUuid,
  //   name: name.value,
  //   mr2000instances: mr2000instances.value,
  //   mr3000instances: mr3000instances.value,
  // }
  //
  // let mutationResult
  //
  // mutationResult = await executeMutation(
  //   CREATE_PROJECT,
  //   {
  //     createProjectInput: {
  //       ...params
  //     },
  //   }
  // )
  //
  // if (!mutationResult) {
  //   throw new Error('An error occured while creating the project')
  // }
 onDialogOK()
}
</script>
