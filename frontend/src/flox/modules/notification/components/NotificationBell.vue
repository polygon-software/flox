<template>
  <q-btn round dense flat color="grey-8" icon="notifications">
    <q-badge v-if="hasNotifications" color="red" text-color="white" floating>
      {{ notifications.length }}
    </q-badge>
    <q-menu v-if="hasNotifications">
      <div class="row no-wrap">
        <q-list separator padding style="width: 400px">
          <q-item
            v-for="notification in notifications"
            :key="notification.uuid"
          >
            <q-item-section>
              <q-item-label>
                <strong>{{ notification.deTitle }}</strong>
              </q-item-label>
              <q-item-label caption>
                {{ notification.deContent }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>{{
                format(new Date(notification.createdAt), 'dd.mm.yyyy hh:mm')
              }}</q-item-label>
              <q-btn
                round
                flat
                color="primary"
                icon="check"
                @click="markAsRead(notification)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-menu>
    <q-tooltip>{{
      hasNotifications
        ? $t('notification.notifications')
        : $t('notification.no_notifications')
    }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue';
import { format } from 'date-fns';

import {
  getUnreadNotifications,
  markNotificationAsRead,
} from 'src/flox/modules/notification/services/notification.service';
import { NotificationEntity } from 'src/flox/modules/notification/entities/notification.entity';

const notifications: Ref<NotificationEntity[]> = ref([]);
const hasNotifications: ComputedRef<boolean> = computed(() => {
  return notifications.value.length > 0;
});
/**
 * Re-fetches all notifications
 */
async function refresh(): Promise<void> {
  const unread = await getUnreadNotifications();
  console.log({ unread });
  notifications.value = [...unread].sort((n1, n2) => {
    if (!n1.createdAt || !n2.createdAt) {
      return 0;
    }
    return new Date(n1.createdAt) < new Date(n2.createdAt) ? -1 : 1;
  });
  console.log(notifications.value);
}

/**
 * Marks a notification as read
 * @param notification - notification to be marked
 */
async function markAsRead(notification: NotificationEntity): Promise<void> {
  await markNotificationAsRead(notification.uuid);
  await refresh();
}

void refresh();
</script>

<style scoped></style>
