import { executeQuery } from 'src/apollo/query';
import { NotificationEntity } from 'src/flox/modules/notification/entities/notification.entity';
import { GET_UNREAD_NOTIFICATIONS } from 'src/flox/modules/notification/notification.query';
import { executeMutation } from 'src/apollo/mutation';
import {
  MARK_NOTIFICATION_AS_READ,
  NOTIFY_ALL_USERS,
  NOTIFY_USERS,
} from 'src/flox/modules/notification/notification.mutation';

/**
 * Loads all unread notifications for the currently logged in user
 * @returns unread notifications
 */
export async function getUnreadNotifications(): Promise<NotificationEntity[]> {
  const { data } = await executeQuery<NotificationEntity[]>(
    GET_UNREAD_NOTIFICATIONS
  );
  return data;
}

/**
 * Marks a notification as read by user
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
 * @param receivers - uuids of users that shall receive notificatoin
 * @param deTitle - title of notification in german
 * @param deContent - content of notification in german
 * @param enTitle - title of notification in english
 * @param enContent - content of notification in english
 * @param link - link to which user is being directed on notification click
 * @returns sent out notifications
 */
export async function sendNotificationToUsers(
  receivers: string[],
  {
    deTitle,
    deContent,
    enTitle,
    enContent,
    link,
  }: {
    deTitle: string;
    deContent: string;
    enTitle: string;
    enContent: string;
    link?: string;
  }
): Promise<NotificationEntity | null> {
  const { data } = await executeMutation<NotificationEntity>(NOTIFY_USERS, {
    receivers,
    deTitle,
    deContent,
    enTitle,
    enContent,
    link,
  });
  return data ?? null;
}

export async function sendNotificationToEveryone({
  deTitle,
  deContent,
  enTitle,
  enContent,
  link,
}: {
  deTitle: string;
  deContent: string;
  enTitle: string;
  enContent: string;
  link?: string;
}): Promise<NotificationEntity | null> {
  const { data } = await executeMutation<NotificationEntity>(NOTIFY_ALL_USERS, {
    deTitle,
    deContent,
    enTitle,
    enContent,
    link,
  });
  return data ?? null;
}
