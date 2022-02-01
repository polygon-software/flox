import { Notification } from 'src/data/types/Notification';
import { subscribeToQuery } from 'src/helpers/data-helpers';
import { MY_NOTIFICATIONS } from 'src/data/queries/NOTIFICATIONS';
import { onBeforeMount, onServerPrefetch, ref, Ref } from 'vue';

/**
 * Fetch notifications of current user.
 * @returns {Notification[]} - my notifications
 */
export function fetchMyNotifications(): Ref<Notification[]> {
  const { serverPrefetch, beforeMount, res } =
    subscribeToQuery(MY_NOTIFICATIONS);
  // ----- Hooks -----
  onServerPrefetch(serverPrefetch);
  onBeforeMount(beforeMount);

  const myNotifications: Ref<Notification[]> = ref([]);
  const records = res.value ?? [];
  records.forEach((record) => {
    const notification = new Notification(
      record.title as string,
      new Date(record.received as string),
      record.content as string,
      record.isRead as boolean,
      record.uuid as string
    );
    if (notification.validate()) {
      myNotifications.value.push(notification);
    } else {
      console.error('Invalid Notification!', notification, record);
    }
  });
  return myNotifications;
}
