<template>
  <div class="row justify-between items-center">
    <h4>{{ $t('access_control.access_control') }}</h4>
    <q-btn
      color="primary"
      :label="$t('access_control.create_group')"
      icon-right="group_add"
      no-caps
      unelevated
      @click="openCreateAccessGroupDialog"
    />
  </div>
  <div class="row">
    <div class="col-12 col-lg-4 q-pa-sm">
      <DataTable
        ref="userGroupTableRef"
        :title="$t('access_control.access_groups')"
        :prepend-name="$t('access_control.users')"
        remove-icon="group_remove"
        :remove-label="$t('access_control.delete_group')"
        prepend-slot
        delete-selection
        hide-column-selector
        hide-fullscreen
        hide-search
        :columns="userGroupColumns"
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
              <MultiUserAvatars :users="slotProps.row.users" />
            </div>
          </q-td>
        </template>
      </DataTable>
    </div>
    <div class="col-12 col-lg-8 q-pa-sm">
      <UserTable
        v-if="selectedGroup"
        :users="selectedGroup?.users ?? []"
        :title="$t('access_control.users')"
        @update:selected="selectedUsers = $event"
      >
        <template #bottom>
          <div
            v-if="selectedUsers.length === 0"
            class="row full-width justify-end q-pt-md"
          >
            <LazySearchField
              v-model="usersToAdd"
              class="q-mr-md"
              :query="SEARCH_USERS"
              options-label="username"
              :select-props="{ label: $t('access_control.add_users') }"
            />
            <q-btn
              :disable="usersToAdd.length === 0"
              outline
              no-caps
              color="primary"
              :label="$t('access_control.add_to_group')"
              icon-right="person_add"
              @click="addUsersToGroup"
            />
          </div>
          <div v-else class="row full-width justify-end q-pt-md">
            <ConfirmButton
              :label="$t('access_control.remove_user')"
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
import { computed, ComputedRef, ref, Ref } from 'vue';
import { useQuasar } from 'quasar';

import { ColumnAlign, ColumnInterface } from 'components/tables/useDataTable';
import UserGroupEntity from 'src/flox/modules/access-control/entities/user-group.entity';
import {
  UPDATE_USER_GROUP,
  DELETE_USER_GROUP,
} from 'src/flox/modules/access-control/access-control.mutation';
import { SEARCH_USERS } from 'src/flox/modules/auth/user.query';
import { SEARCH_USER_GROUPS } from 'src/flox/modules/access-control/access-control.query';
import DataTable from 'components/tables/DataTable.vue';
import CreateAccessControlGroupDialog from 'src/flox/modules/access-control/components/dialogs/CreateAccessControlGroupDialog.vue';
import UserTable from 'src/flox/modules/auth/components/tables/UserTable.vue';
import UserEntity from 'src/flox/modules/auth/entities/user.entity';
import ConfirmButton from 'components/buttons/ConfirmButton.vue';
import {
  addUsersToUserGroup,
  removeUserFromUserGroup,
} from 'src/flox/modules/access-control/services/access-control.service';
import { sleep } from 'src/tools/general.tool';
import LazySearchField from 'src/flox/modules/form/components/LazySearchField.vue';
import MultiUserAvatars from 'src/flox/modules/auth/components/avatar/MultiUserAvatars.vue';
import { i18n } from 'boot/i18n';

const $q = useQuasar();

const userGroupTableRef: Ref<InstanceType<typeof DataTable> | null> = ref(null);

const selectedGroups: Ref<UserGroupEntity[]> = ref([]);
const selectedUsers: Ref<UserEntity[]> = ref([]);

const usersToAdd: Ref<UserEntity[]> = ref([]);

const selectedGroup: ComputedRef<UserGroupEntity | null> = computed(() => {
  if (selectedGroups.value.length > 0) {
    return selectedGroups.value[0];
  }
  return null;
});

/**
 * Reloads the access groups and their members
 */
async function refresh(): Promise<void> {
  if (!userGroupTableRef.value) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  userGroupTableRef.value.refresh();
  const selectedGroupUuid = selectedGroup.value?.uuid;
  await sleep(500);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  selectedGroups.value = userGroupTableRef.value.rows.filter(
    (r: UserGroupEntity): boolean => r.uuid === selectedGroupUuid
  );
}

/**
 * Removes selected user from access group
 */
async function removeUserFromGroup(): Promise<void> {
  if (selectedGroup.value && selectedUsers.value.length > 0) {
    await removeUserFromUserGroup(
      selectedGroup.value.uuid,
      selectedUsers.value[0].uuid
    );
    selectedUsers.value = [];
    await refresh();
  }
}

/**
 * Add selected users to access group
 */
async function addUsersToGroup(): Promise<void> {
  if (selectedGroup.value && usersToAdd.value.length > 0) {
    await addUsersToUserGroup(
      selectedGroup.value.uuid,
      usersToAdd.value.map((user: UserEntity): string => user.uuid)
    );
    await refresh();
  }
}

/**
 * Opens the access group creation dialog
 */
function openCreateAccessGroupDialog(): void {
  $q.dialog({
    component: CreateAccessControlGroupDialog,
    componentProps: {},
  }).onOk(() => {
    void refresh();
  });
}

const userGroupColumns: Ref<ColumnInterface<UserGroupEntity>[]> = ref([
  {
    name: 'name',
    align: ColumnAlign.left,
    label: i18n.global.t('access_control.group_name'),
    field: 'name',
    sortable: true,
    edit: true,
  },
]);
</script>
