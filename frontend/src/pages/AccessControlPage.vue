<template>
  <div class="row justify-between items-center">
    <h4>Alias</h4>
    <q-btn
      color="primary"
      label="Create User Group"
      icon-right="group_add"
      no-caps
      @click="openCreateDialog"
    />
  </div>
  <div class="row">
    <div class="col-12 col-lg-4 q-pa-sm">
      <DataTable
        ref="userGroupTable"
        title="User Groups"
        prepend-name="Users"
        remove-icon="group_remove"
        remove-label="Delete Group"
        prepend-slot
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
        <template #prepend="slotProps">
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
                v-if="slotProps.row.users.length > 5"
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
    <div class="col-12 col-lg-8 q-pa-sm">
      <UserTable
        v-if="selectedGroup"
        :users="selectedGroup.users"
        title="Users"
        @update:selected="selectedUsers = $event"
      >
        <template #bottom>
          <div
            v-if="selectedUsers.length === 0"
            class="row full-width justify-end q-pt-md"
          >
            <LazySearchField
              v-model="addUsers"
              class="q-mr-md"
              :query="SEARCH_USERS"
              options-label="username"
              :select-props="{ label: 'Add Users' }"
            />
            <q-btn
              :disable="addUsers.length === 0"
              outline
              no-caps
              color="primary"
              label="Add to Group"
              icon-right="person_add"
              @click="addUsersToGroup"
            />
          </div>
          <div v-else class="row full-width justify-end q-pt-md">
            <ConfirmButton
              label="Remove User"
              confirm-label="Confirm removal"
              :button-props="{
                color: 'negative',
                iconRight: 'person_remove',
                noCaps: true,
              }"
              @click="removeUserFromGroup"
            />
          </div>
        </template>
      </UserTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, nextTick, ref, Ref } from 'vue';
import { useQuasar } from 'quasar';

import { ColumnInterface } from 'components/tables/useDataTable';
import UserGroupEntity from 'src/flox/modules/access-control/entities/user-group.entity';
import {
  UPDATE_USER_GROUP,
  DELETE_USER_GROUP,
} from 'src/flox/modules/access-control/access-control.mutation';
import { SEARCH_USERS } from 'src/flox/modules/auth/user.query';
import { SEARCH_USER_GROUPS } from 'src/flox/modules/access-control/access-control.query';
import DataTable from 'components/tables/DataTable.vue';
import CreateAccessControlGroup from 'src/flox/modules/access-control/components/dialogs/CreateAccessControlGroupDialog.vue';
import { avatarForUser } from 'src/flox/modules/auth/services/user.service';
import UserTable from 'src/flox/modules/auth/components/tables/UserTable.vue';
import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';
import ConfirmButton from 'components/buttons/ConfirmButton.vue';
import {
  addUsersToUserGroup,
  removeUserFromUserGroup,
} from 'src/flox/modules/access-control/services/access-control.service';
import { sleep } from 'src/tools/general.tool';
import LazySearchField from 'components/forms/LazySearchField.vue';

const $q = useQuasar();

const userGroupTable: Ref<InstanceType<typeof DataTable> | null> = ref(null);
const selectedGroups: Ref<UserGroupEntity[]> = ref([]);
const selectedUsers: Ref<UserEntity[]> = ref([]);
const addUsers: Ref<UserEntity[]> = ref([]);
const selectedGroup: ComputedRef<UserGroupEntity | null> = computed(() => {
  if (selectedGroups.value.length > 0) {
    return selectedGroups.value[0];
  }
  return null;
});

async function refresh(): void {
  if (userGroupTable.value) {
    userGroupTable.value.refresh();
  }
  const selectedGroupUuid = selectedGroup.value?.uuid;
  await sleep(500);
  selectedGroups.value = userGroupTable.value.rows.filter(
    (r: UserGroupEntity): boolean => r.uuid === selectedGroupUuid
  );
}

async function removeUserFromGroup(): Promise<void> {
  if (selectedGroup.value && selectedUsers.value.length > 0) {
    await removeUserFromUserGroup(
      selectedGroup.value.uuid,
      selectedUsers.value[0].uuid
    );
    refresh();
  }
}
async function addUsersToGroup(): void {
  if (selectedGroup.value && addUsers.value.length > 0) {
    await addUsersToUserGroup(
      selectedGroup.value.uuid,
      addUsers.value.map((user: UserEntity): string => user.uuid)
    );
    refresh();
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
