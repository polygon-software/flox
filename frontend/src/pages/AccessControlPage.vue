<template>
  <div class="row justify-between items-center">
    <h4>Alias</h4>
    <q-btn
      color="primary"
      label="Create"
      icon-right="add"
      @click="openCreateDialog"
    />
  </div>
  <div class="row">
    <div class="col-4">
      <DataTable
        ref="userGroupTable"
        title="User Groups"
        append-name="Users"
        append-slot
        delete-selection
        hide-column-selector
        hide-fullscreen
        hide-search
        :columns="columns"
        :query="SEARCH_USER_GROUPS"
        :update-mutation="UPDATE_USER_GROUP"
        :delete-mutation="DELETE_USER_GROUP"
        @update:selected="selectedGroups = $event"
      >
        <template #append="slotProps">
          <q-td :props="slotProps">
            <div
              class="row items-center justify-end relative-position full-height"
            >
              <template
                v-for="(user, n) in slotProps.row.users"
                :key="user.uuid"
              >
                <q-avatar
                  v-if="n < 5"
                  size="26px"
                  class="absolute"
                  :style="`right: ${(5 - n) * 15}px`"
                >
                  <img
                    :src="avatarForUser(user.uuid)"
                    style="border: 2px solid white"
                  />
                </q-avatar>
              </template>
              <span
                v-if="slotProps.row.users.length >= 5"
                style="margin-left: 90px"
                class="text-weight-bolder"
              >
                +{{ slotProps.row.users.length - 5 }}
              </span>
            </div>
          </q-td>
        </template>
      </DataTable>
    </div>
    <div class="col-8"></div>
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
import CreateAccessControlGroup from 'src/flox/modules/access-control/components/Dialogs/CreateAccessControlGroupDialog.vue';
import { avatarForUser } from 'src/flox/modules/auth/services/user.service';

const $q = useQuasar();

const userGroupTable: Ref<typeof DataTable | null> = ref(null);
const selectedGroups: Ref<UserGroupEntity[]> = ref([]);

function refresh(): void {
  if (userGroupTable.value) {
    userGroupTable.value.refresh();
  }
}

function openCreateDialog(): void {
  $q.dialog({
    component: CreateAccessControlGroup,

    // props forwarded to your custom component
    componentProps: {
      text: 'something',
      // ...more..props...
    },
  }).onOk(() => {
    refresh();
  });
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
