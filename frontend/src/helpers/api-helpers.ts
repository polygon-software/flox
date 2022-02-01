import { Notification } from 'src/data/types/Notification';
import { subscribeToQuery } from 'src/helpers/data-helpers';
import { MY_NOTIFICATIONS } from 'src/data/queries/NOTIFICATIONS';
import { computed, Ref } from 'vue';
import { Product } from 'src/data/types/Product';
import { ALL_PRODUCTS, MY_PRODUCTS } from 'src/data/queries/PRODUCT';
import {
  CATEGORY,
  CURRENCY,
  PRODUCT_STATUS,
  ROLE,
  USER_STATUS,
} from '../../../shared/definitions/ENUM';
import { Announcement } from 'src/data/types/Announcement';
import { ALL_ANNOUNCEMENTS } from 'src/data/queries/ANNOUNCEMENTS';
import { ALL_PARTNERS } from 'src/data/queries/USER';
import { User } from 'src/data/types/User';
import { Address } from 'src/data/types/Address';

/**
 * Fetch notifications of current user.
 * @returns {Ref<Notification[]>} - my notifications
 */
export function fetchMyNotifications(): Ref<Notification[]> {
  const queryResult = subscribeToQuery(MY_NOTIFICATIONS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapNotifications(queryResult));
}

/**
 * Fetch all products.
 * @returns {Ref<Product[]>} - all products
 */
export function fetchAllProducts(): Ref<Product[]> {
  const queryResult = subscribeToQuery(ALL_PRODUCTS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapProducts(queryResult));
}

/**
 * Fetch my products.
 * @returns {Ref<Product[]>} - my products
 */
export function fetchMyProducts(): Ref<Product[]> {
  const queryResult = subscribeToQuery(MY_PRODUCTS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapProducts(queryResult));
}

/**
 * Fetch all announcements.
 * @returns {Ref<Announcement[]>} - all announcements
 */
export function fetchAllAnnouncements(): Ref<Announcement[]> {
  const queryResult = subscribeToQuery(ALL_ANNOUNCEMENTS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapAnnouncements(queryResult));
}

/**
 * Fetch all partners.
 * @returns {Ref<User[]>} - all partners
 */
export function fetchAllPartners(): Ref<User[]> {
  const queryResult = subscribeToQuery(ALL_PARTNERS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapUsers(queryResult));
}

/**
 * Map notification records to notification instances.
 * @param {Ref<Record<string, unknown>[]>} queryResult - notification records.
 * @returns {Notification[]} - notification instances.
 */
export function mapNotifications(
  queryResult: Ref<Record<string, unknown>[]>
): Notification[] {
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
}

/**
 * Map product records to product instances.
 * @param {Ref<Record<string, unknown>[]>} queryResult - product records.
 * @returns {Product[]} - product instances.
 */
export function mapProducts(
  queryResult: Ref<Record<string, unknown>[]>
): Product[] {
  const productRecords = queryResult.value ?? [];
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
}

/**
 * Map announcement records to announcement instances.
 * @param {Ref<Record<string, unknown>[]>} queryResult - announcement records.
 * @returns {Announcement[]} - announcement instances.
 */
export function mapAnnouncements(
  queryResult: Ref<Record<string, unknown>[]>
): Announcement[] {
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
}

/**
 * Map user records to user instances.
 * @param {Ref<Record<string, unknown>[]>} queryResult - user records.
 * @returns {User[]} - user instances.
 */
export function mapUsers(queryResult: Ref<Record<string, unknown>[]>): User[] {
  const records = queryResult.value ?? [];
  return records.map(
    (record) =>
      new User(
        record.role as ROLE,
        record.status as USER_STATUS,
        record.uuid as string,
        record.fullName as string,
        record.username as string,
        mapAddress(record.address as Record<string, unknown>),
        record.phone as string,
        record.email as string,
        new Date(record.birthday as string),
        new Date(record.disabledUntil as string)
      )
  );
}

/**
 * Map address record to address instance.
 * @param {Record<string, unknown>} record - address record.
 * @returns {Address} - address instance.
 */
export function mapAddress(record: Record<string, unknown>): Address {
  return new Address(
    record.street as string,
    record.number as string,
    record.city as string,
    record.zipCode as string
  );
}
