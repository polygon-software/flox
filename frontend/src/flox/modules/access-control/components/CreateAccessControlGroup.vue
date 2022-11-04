<template>
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
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

import { createUserGroup } from 'src/flox/modules/access-control/services/access-control.service';
import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';
import LazySearchField from 'components/forms/LazySearchField.vue';

const newGroupName: Ref<string> = ref('');
const selectedUsers: Ref<UserEntity[]> = ref([]);

async function createNewGroup() {
  await createUserGroup(
    newGroupName.value,
    selectedUsers.value.map((user) => user.uuid)
  );
}
</script>

<style scoped></style>
