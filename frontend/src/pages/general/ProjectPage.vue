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
        @click="editProjectName"
      />
    </div>

    <ProjectTable/>

  </q-page>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import ProjectTable from 'components/tables/ProjectTable.vue';
import {useQuasar} from 'quasar';
import EditProjectDialog from 'components/dialogs/EditProjectDialog.vue';

const $q = useQuasar()

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
function editProjectName(){
  $q.dialog({
    component: EditProjectDialog,
    componentProps: {}
  })
}
</script>
