import { Notification } from 'src/data/types/Notification';
import { subscribeToQuery } from 'src/helpers/data-helpers';
import { MY_NOTIFICATIONS } from 'src/data/queries/NOTIFICATIONS';
import { computed, Ref } from 'vue';
import { Product } from 'src/data/types/Product';
import { ALL_PRODUCTS } from 'src/data/queries/PRODUCT';
import {
  CATEGORY,
  CURRENCY,
  PRODUCT_STATUS,
  ROLE,
} from '../../../shared/definitions/ENUM';
import { Announcement } from 'src/data/types/Announcement';
import { ALL_ANNOUNCEMENTS } from 'src/data/queries/ANNOUNCEMENTS';

/**
 * Fetch notifications of current user.
 * @returns {Ref<Notification[]>} - my notifications
 */
export function fetchMyNotifications(): Ref<Notification[]> {
  const queryResult = subscribeToQuery(MY_NOTIFICATIONS) as Ref<
    Record<string, unknown>[]
  >;

  return computed(() => {
    const records = queryResult.value ?? [];
    return records.map(
      (record) =>
        new Notification(
          record.title as string,
          new Date(record.received as string),
          record.content as string,
          record.isRead as boolean,
          record.uuid as string
        )
    );
  });
}

/**
 * Fetch all products.
 * @returns {Ref<Product[]>} - all products
 */
export function fetchAllProducts(): Ref<Product[]> {
  const queryResult = subscribeToQuery(ALL_PRODUCTS) as Ref<
    Record<string, unknown>[]
  >;

  return computed(() => {
    const productRecords = queryResult?.value ?? [];
    return productRecords.map(
      (record) =>
        new Product(
          record.uuid as string,
          record.title as string,
          record.description as string,
          record.brand as string,
          record.category as CATEGORY,
          record.value as number,
          record.currency as CURRENCY,
          new Date(record.start as string),
          new Date(record.end as string),
          record.pictures as Record<string, string>[],
          record.status as PRODUCT_STATUS,
          record.sponsored as boolean,
          record.directBuyLink as string,
          record.directBuyLinkCLicks as number,
          record.directBuyLinkMaxClicks as number,
          record.directBuyLinkCost as number,
          record.directBuyLinkMaxCost as number,
          record.brandLink as string,
          record.brandLinkClicks as number,
          record.brandLinkMaxClicks as number,
          record.brandLinkCost as number,
          record.brandLinkMaxCost as number,
          record.minBet as number,
          record.maxBet as number,
          record.tags as string[],
          record.comments as Record<string, string>[],
          record.likes as number
        )
    );
  });
}

/**
 * Fetch all announcements.
 * @returns {Ref<Announcement[]>} - all announcements
 */
export function fetchAllAnnouncements(): Ref<Announcement[]> {
  const queryResult = subscribeToQuery(ALL_ANNOUNCEMENTS) as Ref<
    Record<string, unknown>[]
  >;

  return computed(() => {
    const records = queryResult.value ?? [];
    return records.map(
      (record) =>
        new Announcement(
          record.title as string,
          new Date(record.date as string),
          record.content as string,
          record.userRoles as ROLE[],
          record.scheduled as boolean,
          record.uuid as string
        )
    );
  });
}
