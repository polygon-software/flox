<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 600px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('access_control.manage_groups') }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section>
        <p v-if="readWriteUserAccessGroups.length === 0">
          {{ $t('access_control.no_access_groups') }}
        </p>
        <q-list bordered separator class="rounded-borders">
          <q-item
            v-for="group in readWriteUserAccessGroups"
            :key="group.uuid"
            :active="
              (group.added && group.read) || (!group.added && !group.read)
            "
            :active-class="
              group.added && group.read ? 'bg-green-1' : 'bg-red-1'
            "
          >
            <q-item-section avatar class="items-start relative-position">
              <MultiUserAvatars :users="group?.users ?? []" />
            </q-item-section>
            <q-item-section>{{ group.name }}</q-item-section>
            <q-item-section side>
              <div class="row">
                <q-toggle
                  v-model="group.read"
                  :disable="group.write"
                  :label="$t('access_control.read')"
                />
                <q-toggle
                  v-model="group.write"
                  :label="$t('access_control.write')"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="row full-width justify-end q-pt-md">
          <LazySearchField
            v-model="userGroupsToAddToEntity"
            :label="$t('access_control.add_group')"
            :query="SEARCH_USER_GROUPS"
            options-label="name"
            class="full-width"
            :select-props="{ label: $t('access_control.search_groups') }"
          />
          <q-btn
            :disable="userGroupsToAddToEntity.length === 0"
            outline
            no-caps
            color="primary"
            :label="$t('access_control.add_to_group')"
            icon-right="person_add"
            class="q-mt-sm"
            @click="addSelectedUserGroupsToReadWrite"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          unelevated
          :label="$t('general.cancel')"
          @click="onDialogCancel"
        />
        <q-btn
          unelevated
          color="primary"
          :label="$t('general.apply')"
          icon-right="add"
          @click="resolveAddRemoveReadWriteGroups"
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
import LazySearchField from 'src/flox/modules/form/components/LazySearchField.vue';
import MultiUserAvatars from 'src/flox/modules/auth/components/avatar/MultiUserAvatars.vue';

const props = defineProps<{
  readAccess: UserGroupEntity[];
  writeAccess: UserGroupEntity[];
}>();

// eslint-disable-next-line vue/define-emits-declaration
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const userGroupsToAddToEntity: Ref<UserGroupEntity[]> = ref([]);
const readWriteUserAccessGroups: Ref<ReadWriteUserGroup[]> = ref([]);

interface ReadWriteUserGroup extends UserGroupEntity {
  read: boolean;
  write: boolean;
  added: boolean;
}

/**
 * Adds the selected user groups to the read write user groups and resets the input
 */
function addSelectedUserGroupsToReadWrite(): void {
  readWriteUserAccessGroups.value.push(
    ...userGroupsToAddToEntity.value.map((group) => ({
      ...group,
      read: true,
      write: false,
      added: true,
    }))
  );
  userGroupsToAddToEntity.value = [];
}

onMounted(() => {
  const writeAccessGroupsUuids = props.writeAccess.map((group) => group.uuid);
  readWriteUserAccessGroups.value.push(
    ...props.writeAccess.map((group) => ({
      ...group,
      read: true,
      write: true,
      added: false,
    })),
    ...props.readAccess
      .filter((group) => {
        return !writeAccessGroupsUuids.includes(group.uuid);
      })
      .map((group) => ({
        ...group,
        read: true,
        write: false,
        added: false,
      }))
  );
});

/**
 * Calculates which access groups should be added/removed for read/write access and closes popup
 */
function resolveAddRemoveReadWriteGroups(): void {
  const addReadAccess = readWriteUserAccessGroups.value
    .filter((group) => group.read)
    .map((group) => group.uuid);
  const removeReadAccess = readWriteUserAccessGroups.value
    .filter((group) => !group.read)
    .map((group) => group.uuid);
  const addWriteAccess = readWriteUserAccessGroups.value
    .filter((group) => group.write)
    .map((group) => group.uuid);
  const removeWriteAccess = readWriteUserAccessGroups.value
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
