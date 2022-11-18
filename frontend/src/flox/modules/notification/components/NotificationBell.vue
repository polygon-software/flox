<template>
  <q-btn round dense flat color="grey-8" icon="notifications">
    <q-badge v-if="hasNotifications" color="red" text-color="white" floating>
      {{ notifications?.length }}
    </q-badge>
    <q-menu v-if="hasNotifications">
      <div class="row no-wrap">
        <q-list separator padding style="width: 400px">
          <q-item
            v-for="notification in sortedNotifications"
            :key="notification.uuid"
            :clickable="!!extractLangContent(notification)?.link"
            @click="clickLink(notification)"
          >
            <q-item-section>
              <q-item-label>
                <strong>{{ extractLangContent(notification)?.title }}</strong>
              </q-item-label>
              <q-item-label caption>
                {{ extractLangContent(notification)?.content }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label v-if="notification?.createdAt" caption>
                {{
                  format(new Date(notification?.createdAt), 'dd.mm.yyyy hh:mm')
                }}
              </q-item-label>
              <q-btn
                round
                flat
                color="primary"
                icon="check"
                @click.stop="markAsRead(notification)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-menu>
    <q-tooltip>{{
      hasNotifications
        ? $t('notifications.notifications')
        : $t('notifications.no_notifications')
    }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed, ComputedRef, Ref } from 'vue';
import { format } from 'date-fns';
import { useRouter } from 'vue-router';

import {
  markNotificationAsRead,
  subscribeToUnreadNotifications,
} from 'src/flox/modules/notification/services/notification.service';
import NotificationEntity from 'src/flox/modules/notification/entities/notification.entity';
import { i18n } from 'boot/i18n';
import MessageEntity from 'src/flox/modules/notification/entities/message.entity';

const $router = useRouter();

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
 * Extracts the message in the correct lang (or fallback locale) from the notification
 *
 * @param notification - notification
 * @returns message in correct language
 */
function extractLangContent(
  notification: NotificationEntity
): MessageEntity | undefined {
  const messages = notification?.messages ?? [];
  const correctLang = messages.find(
    (msg) => msg.lang === i18n.global.locale.value
  );
  if (correctLang) {
    return correctLang;
  }
  return messages.find((msg) => msg.lang === i18n.global.fallbackLocale.value);
}

/**
 * Routes to the location specified by link
 *
 * @param notification - notification of which to follow link
 */
async function clickLink(notification: NotificationEntity): Promise<void> {
  const message = extractLangContent(notification);
  if (message?.link) {
    await $router.push(message.link);
    await markNotificationAsRead(notification.uuid);
  }
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
