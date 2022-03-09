<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title: Projects -->
    <div class="row items-center">
      <h5>{{ $t('dashboard.project') }} {{ projectId.toUpperCase() }}</h5>
      <q-btn
        icon="edit"
        text-color="primary"
        round
        unelevated
        size="xs"
        style="height: 30px; width: 30px; margin-left: 5px"
        :disable="!projectUuid"
        @click="editProjectName"
      />
    </div>

    <ProjectTable/>

  </q-page>
</template>

<script setup lang="ts">
import {defineProps, inject, onMounted, ref, Ref} from 'vue';
import ProjectTable from 'components/tables/ProjectTable.vue';
import {useQuasar} from 'quasar';
import EditProjectDialog from 'components/dialogs/EditProjectDialog.vue';
import {myProjects} from 'src/helpers/api-helpers';
import {RouterService} from 'src/services/RouterService';
import {showNotification} from 'src/helpers/notification-helpers';
import {i18n} from 'boot/i18n';

const $q = useQuasar()
const routerService: RouterService|undefined = inject('$routerService')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  projectId: {
    required: true,
    type: String
  }
})

const projectUuid: Ref<null|string> = ref(null)

// Once mounted, determine actual project entry's UUID (for editing)
onMounted(async () => {
  const ownProjects = await myProjects()
  const project = ownProjects.find((project) => project.name === props.projectId)

  if(project){
    projectUuid.value = project.uuid
  }
})

/**
 * Shows a dialog for editing a project's name
 * @returns {void}
 */
function editProjectName(){
  $q.dialog({
    component: EditProjectDialog,
    componentProps: {
      name: props.projectId,
      uuid: projectUuid.value,
    }
  }).onOk(async (newName: string) => {
    // After editing is finished, show success notification
    showNotification(
      $q,
      i18n.global.t('messages.project_renamed'),
      'bottom',
      'positive',
    )

    // Navigate to project's new URL
    await routerService?.goBack()
    await routerService?.addToRoute(newName)
  })
}
</script>
