import { Notification } from 'src/data/types/Notification';
import { subscribeToQuery } from 'src/helpers/data-helpers';
import { MY_NOTIFICATIONS } from 'src/data/queries/NOTIFICATIONS';
import { Ref } from 'vue';

/**
 * Fetch notifications of current user.
 * @returns {Notification[]} - my notifications
 */
export function fetchMyNotifications(): Notification[]{
  const myNotificationsQueryResult = subscribeToQuery(MY_NOTIFICATIONS) as Ref<Array<Record<string, unknown>>>
  const myNotifications: Notification[] = []
  const records = myNotificationsQueryResult.value  ?? [];
  console.log(records)
  records.forEach(record => {
    const notification = new Notification(
      record.title as string,
      new Date(record.received as string),
      record.content as string,
      record.isRead as boolean,
      record.uuid as string,
    )
    if(notification.validate()){
      myNotifications.push(notification)
    } else {
      console.error('Invalid Notification!', notification, record)
    }
  });
  return myNotifications;
}
