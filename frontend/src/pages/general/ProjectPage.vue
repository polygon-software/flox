<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title: Projects -->
    <div class="row items-center">
      <!-- Project name -->
      <h5>{{ $t('dashboard.project') }} {{ projectId.toUpperCase() }}</h5>

      <!-- Edit button -->
      <q-btn
        icon="edit"
        text-color="primary"
        round
        unelevated
        size="xs"
        style="height: 30px; width: 30px; margin-left: 5px"
        :disable="!projectUuid"
        @click="editProject"
      />
    </div>

    <ProjectTable
      :name="props.projectId"
    />

  </q-page>
</template>

<script setup lang="ts">
import {defineProps, inject} from 'vue';
import ProjectTable from 'components/tables/ProjectTable.vue';
import {useQuasar} from 'quasar';
import EditProjectDialog from 'components/dialogs/EditProjectDialog.vue';
import {RouterService} from 'src/services/RouterService';
import {showNotification} from 'src/helpers/notification-helpers';
import {i18n} from 'boot/i18n';
import {ErrorService} from 'src/services/ErrorService';

const $q = useQuasar()
const routerService: RouterService|undefined = inject('$routerService')
const errorService: ErrorService|undefined = inject('$errorService')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  projectId: {
    required: true,
    type: String
  }
})


/**
 * Shows a dialog for editing a project's name
 * @returns {void}
 */
function editProject(){
  $q.dialog({
    component: EditProjectDialog,
    componentProps: {
      name: props.projectId,
      q: $q,
      routerService: routerService,
      errorService: errorService
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
