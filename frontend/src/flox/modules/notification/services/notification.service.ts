import { Ref } from 'vue';

import { executeQuery, subscribeToQuery } from 'src/apollo/query';
import NotificationEntity from 'src/flox/modules/notification/entities/notification.entity';
import { GET_UNREAD_NOTIFICATIONS } from 'src/flox/modules/notification/notification.query';
import { executeMutation } from 'src/apollo/mutation';
import {
  MARK_NOTIFICATION_AS_READ,
  NOTIFY_ALL_USERS,
  NOTIFY_USERS,
} from 'src/flox/modules/notification/notification.mutation';

export type Message = {
  lang: string;
  title: string;
  content: string;
  link?: string;
};

/**
 * Loads all unread notifications for the currently logged in user
 *
 * @returns unread notifications
 */
export async function getUnreadNotifications(): Promise<NotificationEntity[]> {
  const { data } = await executeQuery<NotificationEntity[]>(
    GET_UNREAD_NOTIFICATIONS
  );
  return data;
}

/**
 * Subscribes to unread notifications
 *
 * @returns reactive array of notifications
 */
export function subscribeToUnreadNotifications(): Ref<
  NotificationEntity[] | null
> {
  const { data } = subscribeToQuery<NotificationEntity[]>(
    GET_UNREAD_NOTIFICATIONS
  );
  return data;
}

/**
 * Marks a notification as read by user
 *
 * @param uuid - notification uuid
 * @returns read notification
 */
export async function markNotificationAsRead(
  uuid: string
): Promise<NotificationEntity | null> {
  const { data } = await executeMutation<NotificationEntity>(
    MARK_NOTIFICATION_AS_READ,
    {
      uuid,
    }
  );
  return data ?? null;
}

/**
 * Sends a notification to certain users
 *
 * @param recipients - uuids of users that shall receive notification
 * @param messages - messages to be sent out to users
 * @returns sent out notifications
 */
export async function sendNotificationToUsers(
  recipients: string[],
  messages: Message[]
): Promise<NotificationEntity | null> {
  const { data } = await executeMutation<NotificationEntity>(NOTIFY_USERS, {
    recipients,
    messages,
  });
  return data ?? null;
}

/**
 * Sends out a notification to every user within the system
 *
 * @param messages - messages to be sent out to users
 * @returns sent out notifications
 */
export async function sendNotificationToEveryone(
  messages: Message[]
): Promise<NotificationEntity | null> {
  const { data } = await executeMutation<NotificationEntity>(NOTIFY_ALL_USERS, {
    messages,
  });
  return data ?? null;
}
