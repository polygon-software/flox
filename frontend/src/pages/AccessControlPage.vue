<template>
  <div class="row justify-between items-center">
    <h4>Alias</h4>
    <q-btn color="primary" label="Create" icon-right="add" />
  </div>
  <div class="row">
    <div class="col-4">
      <DataTable
        ref="userGroupTable"
        title="User Groups"
        delete-selection
        hide-column-selector
        hide-fullscreen
        hide-search
        :columns="columns"
        :query="SEARCH_USER_GROUPS"
        :update-mutation="UPDATE_USER_GROUP"
        :delete-mutation="DELETE_USER_GROUP"
        @update:selected="selectedGroups = $event"
      />
    </div>
    <div class="col-8">2</div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useQuasar } from 'quasar';

import { ColumnInterface } from 'components/tables/useDataTable';
import UserGroupEntity from 'src/flox/modules/access-control/entities/user-group.entity';
import {
  UPDATE_USER_GROUP,
  DELETE_USER_GROUP,
} from 'src/flox/modules/access-control/access-control.mutation';
import { SEARCH_USER_GROUPS } from 'src/flox/modules/access-control/access-control.query';
import DataTable from 'components/tables/DataTable.vue';
import CreateAccessControlledInput from 'src/flox/modules/access-control/components/CreateAccessControlGroup.vue';

const $q = useQuasar();

const userGroupTable: Ref<typeof DataTable | null> = ref(null);
const selectedGroups: Ref<UserGroupEntity[]> = ref([]);

$q.dialog({
  component: CreateAccessControlledInput,

  componentProps: {},
})
  .onOk(() => {
    console.log('OK');
  })
  .onCancel(() => {
    console.log('Cancel');
  })
  .onDismiss(() => {
    console.log('Called on OK or Cancel');
  });

function refresh(): void {
  if (userGroupTable.value) {
    userGroupTable.value.refresh();
  }
}

const columns: Ref<ColumnInterface<UserGroupEntity>[]> = ref([
  {
    name: 'name',
    label: 'Group Name',
    field: 'name',
    sortable: true,
    edit: true,
  },
]);
</script>

<style scoped></style>
