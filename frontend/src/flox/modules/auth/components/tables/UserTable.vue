<template>
  <q-card class="q-pa-md" flat bordered>
    <slot name="top" />
    <q-table
      v-model:selected="selected"
      :title="title"
      flat
      hide-bottom
      :rows="users"
      :columns="columns"
      row-key="uuid"
      :pagination="initialPagination"
      selection="single"
    >
      <template #body-cell-avatar="props">
        <q-td :props="props">
          <q-avatar size="26px">
            <img
              :src="avatarForUser(props.row.uuid)"
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

const emit = defineEmits<{
  (e: 'update:selected', selected: BaseEntity[]): void;
}>();

const initialPagination = {
  sortBy: 'username',
  descending: false,
  page: 1,
  rowsPerPage: 500,
};

const selected: Ref<UserEntity[]> = ref([]);
watch(selected, (val) => {
  emit('update:selected', val);
});
onBeforeUnmount(() => {
  emit('update:selected', []);
});

const columns: Ref<ColumnInterface<UserEntity>[]> = ref([
  {
    name: 'avatar',
    label: 'Avatar',
    field: 'avatar',
    sortable: false,
  },
  {
    name: 'username',
    label: 'Username',
    field: 'username',
    sortable: true,
  },
  {
    name: 'email',
    label: 'E-Mail',
    field: 'email',
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

<style scoped></style>
