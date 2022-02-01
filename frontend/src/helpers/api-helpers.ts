import { Notification } from 'src/data/types/Notification';
import { subscribeToQuery } from 'src/helpers/data-helpers';
import { MY_NOTIFICATIONS } from 'src/data/queries/NOTIFICATIONS';
import { computed, Ref } from 'vue';

/**
 * Fetch notifications of current user.
 * @returns {Ref<Notification[]>} - my notifications
 */
export function fetchMyNotifications(): Ref<Notification[]> {
  const myNotificationsQueryResult = subscribeToQuery(MY_NOTIFICATIONS) as Ref<
    Record<string, unknown>[]
  >;

  return computed(() => {
    const myNotifications: Notification[] = [];
    const records = myNotificationsQueryResult.value ?? [];
    records.forEach((record) =>
      myNotifications.push(
        new Notification(
          record.title as string,
          new Date(record.received as string),
          record.content as string,
          record.isRead as boolean,
          record.uuid as string
        )
      )
    );
    return myNotifications;
  });
}
