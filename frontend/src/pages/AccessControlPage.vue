<template>
  <h4>Alias</h4>
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
      <q-form>
        <q-input v-model="newGroupName" outlined dense label="New Group Name" />
        <LazySearchField
          v-model="selectedUsers"
          :query="SEARCH_USERS"
          options-label="username"
          :select-props="{ label: 'Select Users' }"
        />
        <q-btn
          color="primary"
          label="Create"
          icon-right="add"
          @click="createNewGroup"
        />
      </q-form>
    </div>
    <div class="col-8">2</div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

import { ColumnInterface } from 'components/tables/useDataTable';
import UserGroupEntity from 'src/flox/modules/access-control/entities/user-group.entity';
import {
  UPDATE_USER_GROUP,
  DELETE_USER_GROUP,
} from 'src/flox/modules/access-control/access-control.mutation';
import { SEARCH_USER_GROUPS } from 'src/flox/modules/access-control/access-control.query';
import DataTable from 'components/tables/DataTable.vue';
import { createUserGroup } from 'src/flox/modules/access-control/services/access-control.service';
import LazySearchField from 'components/forms/LazySearchField.vue';
import { SEARCH_USERS } from 'src/flox/modules/auth/user.query';
import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';

const userGroupTable: Ref<typeof DataTable | null> = ref(null);
const selectedGroups: Ref<UserGroupEntity[]> = ref([]);
const newGroupName: Ref<string> = ref('');
const selectedUsers: Ref<UserEntity[]> = ref([]);

async function createNewGroup() {
  await createUserGroup(
    newGroupName.value,
    selectedUsers.value.map((user) => user.uuid)
  );
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
