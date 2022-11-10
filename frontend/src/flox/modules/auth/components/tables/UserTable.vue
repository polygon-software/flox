<template>
  <q-card class="q-pa-md" flat bordered>
    <slot name="top" />
    <q-table
      v-model:selected="selected"
      :title="title"
      flat
      hide-bottom
      :rows="users"
      :columns="userTableColumns"
      row-key="uuid"
      :pagination="initialPagination"
      selection="single"
    >
      <template #body-cell-avatar="bodyProps">
        <q-td :props="bodyProps">
          <q-avatar size="26px">
            <img
              alt="avatar"
              :src="avatarForUser(bodyProps.row.uuid)"
              style="border: 2px solid white"
            />
          </q-avatar>
        </q-td>
      </template>
    </q-table>
    <slot name="bottom" />
  </q-card>
</template>

<script setup lang="ts">
import { defineProps, onBeforeUnmount, ref, Ref, watch } from 'vue';
import { QTableProps } from 'quasar';

import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';
import { ColumnInterface } from 'components/tables/useDataTable';
import { avatarForUser } from 'src/flox/modules/auth/services/user.service';
import { BaseEntity } from 'src/flox/core/base-entity/entities/BaseEntity';

const props = withDefaults(
  defineProps<{
    users: UserEntity[];
    title: string;
    tableProps: QTableProps;
  }>(),
  {
    tableProps: () => ({}),
  }
);

const EMIT_UPDATE_SELECTED = 'update:selected';

const emit = defineEmits<{
  (e: typeof EMIT_UPDATE_SELECTED, selected: BaseEntity[]): void;
}>();

const initialPagination = {
  sortBy: 'username',
  descending: false,
  page: 1,
  rowsPerPage: 500,
};

const selected: Ref<UserEntity[]> = ref([]);
watch(selected, (val) => {
  emit(EMIT_UPDATE_SELECTED, val);
});
onBeforeUnmount(() => {
  emit(EMIT_UPDATE_SELECTED, []);
});

const userTableColumns: Ref<ColumnInterface<UserEntity>[]> = ref([
  {
    name: 'avatar',
    label: 'Avatar',
    field: 'avatar',
    align: 'left',
    sortable: false,
  },
  {
    name: 'username',
    label: 'Username',
    field: 'username',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'E-Mail',
    field: 'email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'role',
    label: 'Role',
    field: 'role',
    sortable: true,
  },
]);
</script>
