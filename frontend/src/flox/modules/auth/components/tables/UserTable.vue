<template>
  <q-card class="q-pa-md" flat bordered>
    <slot name="top" />
    <q-table
      v-model:selected="selected"
      :title="props.title"
      flat
      hide-bottom
      :rows="props.users"
      :columns="userTableColumns"
      row-key="uuid"
      :pagination="initialPagination"
      selection="single"
      v-bind="props.tableProps"
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
import { i18n } from 'boot/i18n';

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
    label: i18n.global.t('users.avatar'),
    field: 'avatar',
    align: 'left',
    sortable: false,
  },
  {
    name: 'username',
    label: i18n.global.t('users.username'),
    field: 'username',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: i18n.global.t('users.email'),
    field: 'email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'role',
    label: i18n.global.t('users.role'),
    field: 'role',
    sortable: true,
  },
]);
</script>
