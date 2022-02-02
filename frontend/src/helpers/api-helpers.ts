import { Notification } from 'src/data/types/Notification';
import { subscribeToQuery } from 'src/helpers/data-helpers';
import { MY_NOTIFICATIONS } from 'src/data/queries/NOTIFICATIONS';
import { computed, ComputedRef, Ref } from 'vue';
import { Product } from 'src/data/types/Product';
import { ALL_PRODUCTS, MY_PRODUCTS, PRODUCT } from 'src/data/queries/PRODUCT';
import {
  CATEGORY,
  CURRENCY,
  PRODUCT_STATUS,
  ROLE,
  USER_STATUS,
} from '../../../shared/definitions/ENUM';
import { Announcement } from 'src/data/types/Announcement';
import { ALL_ANNOUNCEMENTS } from 'src/data/queries/ANNOUNCEMENTS';
import { ALL_PARTNERS, ALL_PLAYERS } from 'src/data/queries/USER';
import { User } from 'src/data/types/User';
import { Address } from 'src/data/types/Address';

/**
 * Fetch notifications of current user.
 * @returns {ComputedRef<Notification[]>} - my notifications
 */
export function fetchMyNotifications(): ComputedRef<Notification[]> {
  const queryResult = subscribeToQuery(MY_NOTIFICATIONS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapNotifications(queryResult));
}

/**
 * Fetch all products.
 * @returns {ComputedRef<Product[]>} - all products
 */
export function fetchAllProducts(): ComputedRef<Product[]> {
  const queryResult = subscribeToQuery(ALL_PRODUCTS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapProducts(queryResult));
}

/**
 * Fetch my products.
 * @returns {ComputedRef<Product[]>} - my products
 */
export function fetchMyProducts(): ComputedRef<Product[]> {
  const queryResult = subscribeToQuery(MY_PRODUCTS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapProducts(queryResult));
}

/**
 * Fetch all announcements.
 * @returns {ComputedRef<Announcement[]>} - all announcements
 */
export function fetchAllAnnouncements(): ComputedRef<Announcement[]> {
  const queryResult = subscribeToQuery(ALL_ANNOUNCEMENTS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapAnnouncements(queryResult));
}

/**
 * Fetch all partners.
 * @returns {ComputedRef<User[]>} - all partners.
 */
export function fetchAllPartners(): ComputedRef<User[]> {
  const queryResult = subscribeToQuery(ALL_PARTNERS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapUsers(queryResult));
}

/**
 * Fetch all players.
 * @returns {ComputedRef<User[]>} - all players.
 */
export function fetchAllPlayers(): ComputedRef<User[]> {
  const queryResult = subscribeToQuery(ALL_PLAYERS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapUsers(queryResult));
}

/**
 * Fetch product.
 * @param {string} productId - product UUID.
 * @returns {ComputedRef<Product | null>} - product.
 */
export function fetchProduct(productId: string): ComputedRef<Product | null> {
  const queryResult = subscribeToQuery(PRODUCT, {
    uuid: productId,
  }) as Ref<Record<string, unknown> | null>;
  return computed(() =>
    queryResult.value ? mapProduct(queryResult.value) : null
  );
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
  return productRecords.map((record) => mapProduct(record));
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
        new Date(record.birthdate as string),
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

/**
 * Map product record to product instance.
 * @param {Record<string, unknown>} record - product record.
 * @returns {Product} - product instance.
 */
export function mapProduct(record: Record<string, unknown>): Product {
  return new Product({
    uuid: record.uuid as string,
    title: record.title as string,
    description: record.description as string,
    brand: record.brand as string,
    category: record.category as CATEGORY,
    value: record.value as number,
    currency: record.currency as CURRENCY,
    start: new Date(record.start as string),
    end: new Date(record.end as string),
    pictures: record.pictures as Record<string, string>[],
    status: record.status as PRODUCT_STATUS,
    sponsored: record.sponsored as boolean,
    directBuyLink: record.directBuyLink as string,
    directBuyLinkCLicks: record.directBuyLinkCLicks as number,
    directBuyLinkMaxClicks: record.directBuyLinkMaxClicks as number,
    directBuyLinkCost: record.directBuyLinkCost as number,
    directBuyLinkMaxCost: record.directBuyLinkMaxCost as number,
    brandLink: record.brandLink as string,
    brandLinkClicks: record.brandLinkClicks as number,
    brandLinkMaxClicks: record.brandLinkMaxClicks as number,
    brandLinkCost: record.brandLinkCost as number,
    brandLinkMaxCost: record.brandLinkMaxCost as number,
    minBet: record.minBet as number,
    maxBet: record.maxBet as number,
    tags: record.tags as string[],
    comments: record.comments as Record<string, string>[],
    likes: record.likes as number,
  });
}
