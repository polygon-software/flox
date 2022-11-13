<template>
  <q-btn round dense flat color="grey-8" icon="notifications">
    <q-badge v-if="hasNotifications" color="red" text-color="white" floating>
      {{ notifications.length }}
    </q-badge>
    <q-menu v-if="hasNotifications">
      <div class="row no-wrap">
        <q-list separator padding style="width: 400px">
          <q-item
            v-for="notification in sortedNotifications"
            :key="notification.uuid"
          >
            <q-item-section>
              <q-item-label>
                <strong>{{ extractTitle(notification) }}</strong>
              </q-item-label>
              <q-item-label caption>
                {{ extractContent(notification) }}
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
import { computed, ComputedRef, Ref } from 'vue';
import { format } from 'date-fns';

import {
  markNotificationAsRead,
  subscribeToUnreadNotifications,
} from 'src/flox/modules/notification/services/notification.service';
import { NotificationEntity } from 'src/flox/modules/notification/entities/notification.entity';
import { i18n } from 'boot/i18n';

const notifications: Ref<NotificationEntity[] | null> =
  subscribeToUnreadNotifications();
const hasNotifications: ComputedRef<boolean> = computed(() => {
  return !!notifications.value && notifications.value.length > 0;
});

const sortedNotifications: ComputedRef<NotificationEntity[]> = computed(() => {
  if (!notifications.value) {
    return [];
  }
  return [...notifications.value].sort((n1, n2) => {
    if (!n1.createdAt || !n2.createdAt) {
      return 0;
    }
    return new Date(n1.createdAt) < new Date(n2.createdAt) ? -1 : 1;
  });
});

/**
 * Extracts the title of the notification in the currently set language
 *
 * @param notification - the notification
 * @returns notification title
 */
function extractTitle(notification: NotificationEntity): string {
  type notificationKey = keyof NotificationEntity;
  const titleKey = `${i18n.global.locale.value}Title` as notificationKey;
  if (titleKey in notification) {
    return notification[titleKey] as string;
  }
  return notification.enTitle ?? '-';
}

/**
 * Extracts the title of the notification in the currently set language
 *
 * @param notification - the notification
 * @returns notification title
 */
function extractContent(notification: NotificationEntity): string {
  type notificationKey = keyof NotificationEntity;
  const titleKey = `${i18n.global.locale.value}Content` as notificationKey;
  if (titleKey in notification) {
    return notification[titleKey] as string;
  }
  return notification.enContent ?? '-';
}

/**
 * Marks a notification as read
 *
 * @param notification - notification to be marked
 */
async function markAsRead(notification: NotificationEntity): Promise<void> {
  await markNotificationAsRead(notification.uuid);
}
</script>

<style scoped></style>
