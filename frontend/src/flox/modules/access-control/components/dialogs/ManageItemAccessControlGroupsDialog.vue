<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 600px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Manage Access Groups</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section>
        <p v-if="editUserGroups.length === 0">No access groups yet.</p>
        <q-list bordered separator class="rounded-borders">
          <q-item
            v-for="group in editUserGroups"
            :key="group.uuid"
            :active="
              (group.added && group.read) || (!group.added && !group.read)
            "
            :active-class="
              group.added && group.read ? 'bg-green-1' : 'bg-red-1'
            "
          >
            <q-item-section avatar class="items-start relative-position">
              <MultiUserAvatars :users="group.users" />
            </q-item-section>
            <q-item-section>{{ group.name }}</q-item-section>
            <q-item-section side>
              <div class="row">
                <q-toggle
                  v-model="group.read"
                  :disable="group.write"
                  label="Read"
                />
                <q-toggle v-model="group.write" label="Write" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="row full-width justify-end q-pt-md">
          <LazySearchField
            v-model="selectedUserGroups"
            label="Add User Groups"
            :query="SEARCH_USER_GROUPS"
            options-label="name"
            class="full-width"
            :select-props="{ label: 'Search User Group' }"
          />
          <q-btn
            :disable="selectedUserGroups.length === 0"
            outline
            no-caps
            color="primary"
            label="Add to Group"
            icon-right="person_add"
            class="q-mt-sm"
            @click="addSelected"
          />
        </div>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn unelevated label="Cancel" @click="onDialogCancel" />
        <q-btn
          unelevated
          color="primary"
          label="Apply changes"
          icon-right="add"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { onMounted, ref, Ref } from 'vue';

import { SEARCH_USER_GROUPS } from 'src/flox/modules/access-control/access-control.query';
import UserGroupEntity from 'src/flox/modules/access-control/entities/user-group.entity';
import LazySearchField from 'components/forms/LazySearchField.vue';
import MultiUserAvatars from 'src/flox/modules/auth/components/avatar/MultiUserAvatars.vue';

const props = defineProps<{
  readAccess: UserGroupEntity[];
  writeAccess: UserGroupEntity[];
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const selectedUserGroups: Ref<UserGroupEntity[]> = ref([]);
const editUserGroups: Ref<EditUserGroupEntity[]> = ref([]);

interface EditUserGroupEntity extends UserGroupEntity {
  read: boolean;
  write: boolean;
  added: boolean;
}

function addSelected(): void {
  editUserGroups.value.push(
    ...selectedUserGroups.value.map((group) => ({
      ...group,
      read: true,
      write: false,
      added: true,
    }))
  );
  selectedUserGroups.value = [];
}

onMounted(() => {
  const writeUuids = props.writeAccess.map((group) => group.uuid);
  editUserGroups.value.push(
    ...props.writeAccess.map((group) => ({
      ...group,
      read: true,
      write: true,
      added: false,
    })),
    ...props.readAccess
      .filter((group) => {
        return !writeUuids.includes(group.uuid);
      })
      .map((group) => ({
        ...group,
        read: true,
        write: false,
        added: false,
      }))
  );
});

async function onOKClick() {
  const addReadAccess = editUserGroups.value
    .filter((group) => group.read)
    .map((group) => group.uuid);
  const removeReadAccess = editUserGroups.value
    .filter((group) => !group.read)
    .map((group) => group.uuid);
  const addWriteAccess = editUserGroups.value
    .filter((group) => group.write)
    .map((group) => group.uuid);
  const removeWriteAccess = editUserGroups.value
    .filter((group) => !group.write)
    .map((group) => group.uuid);
  onDialogOK({
    addReadAccess,
    removeReadAccess,
    addWriteAccess,
    removeWriteAccess,
  });
}
</script>

<style scoped></style>
