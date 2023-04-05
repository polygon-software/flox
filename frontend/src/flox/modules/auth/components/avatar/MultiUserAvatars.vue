<template>
  <template v-for="(user, n) in users" :key="user.uuid">
    <q-avatar
      v-if="n < 5"
      size="26px"
      class="absolute"
      :style="`left: ${n * 15}px`"
    >
      <img
        :src="avatarForUser(user.uuid)"
        style="border: 2px solid white"
        alt="User Avatar"
      />
    </q-avatar>
  </template>
  <span
    v-if="users.length > 5"
    style="margin-left: 90px"
    class="text-weight-bolder"
  >
    +{{ users.length - 5 }}
  </span>
</template>

<script setup lang="ts">
import UserEntity from 'src/flox/modules/auth/entities/user.entity';
import { avatarForUser } from 'src/flox/modules/auth/services/user.service';

const props = defineProps<{
  users: UserEntity[];
}>();
</script>
