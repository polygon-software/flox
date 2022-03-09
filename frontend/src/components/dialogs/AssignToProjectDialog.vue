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
        <q-item
          v-for="project in projects"
          :key="project.uuid"
          v-ripple
          tag="label"
        >
          <q-item-section avatar>
            <q-radio
              v-model="selectedProject"
              :val="project"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ project.name }}
            </q-item-label>
            <q-item-label caption>
              {{ `(${project.mr2000instances.length + project.mr3000instances.length} ${$tc('projects.device', project.mr2000instances.length + project.mr3000instances.length)})` }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <!-- Actions -->
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
import {defineEmits, defineProps, onMounted, Ref, ref} from 'vue'
import {myProjects} from 'src/helpers/api-helpers';
import {Project} from 'src/data/types/Project';
import {executeMutation} from 'src/helpers/data-helpers';
import {ASSIGN_DEVICE_TO_PROJECT} from 'src/data/mutations/PROJECT';

const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(useDialogPluginComponent.emits)

const projects: Ref<Project[]> = ref([])
const selectedProject: Ref<Project|null> = ref(null)

const props = defineProps({
  cli: {
    type: String,
    required: true,
  }
})

// Load user's projects
onMounted(async () => {
  projects.value = await myProjects()
})

/**
 * Assigns the given device to the chosen project
 * @return {Promise<void>} - done
 */
async function assignToProject() {
  if(selectedProject.value && props.cli){
    let mutationResult

    mutationResult = await executeMutation(
      ASSIGN_DEVICE_TO_PROJECT,
      {
        uuid: selectedProject.value?.uuid,
        cli: props.cli
      }
    )

    if (!mutationResult) {
      throw new Error('An error occurred while assigning the device')
    }
    onDialogOK()
  }
}
</script>
