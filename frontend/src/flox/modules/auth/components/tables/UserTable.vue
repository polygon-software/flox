<template>

</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { QTableProps } from 'quasar';

import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';

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
</script>

<style scoped></style>
