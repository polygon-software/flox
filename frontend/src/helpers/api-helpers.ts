import { subscribeToQuery } from 'src/helpers/data-helpers';
import { computed, ComputedRef, Ref } from 'vue';
import { ALL_USERS, USER } from 'src/data/queries/USER';
import { User } from 'src/data/types/User';
import { Address } from 'src/data/types/Address';
import { ROLE } from 'src/data/ENUM';

/**
 * Fetch all users.
 * @returns {ComputedRef<User[]>} - all users.
 */
export function fetchAllUsers(): ComputedRef<User[]> {
  const queryResult = subscribeToQuery(ALL_USERS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapUsers(queryResult));
}

/**
 * Fetch user.
 * @param {string} userId - user UUID.
 * @returns {ComputedRef<User | null>} - user.
 */
export function fetchUser(userId: string): ComputedRef<User | null> {
  const queryResult = subscribeToQuery(USER, {
    uuid: userId,
  }) as Ref<Record<string, unknown> | null>;
  return computed(() => queryResult.value ? mapUser(queryResult.value): null);
}

/**
 * Map user records to user instances.
 * @param {Ref<Record<string, unknown>[]>} queryResult - user records.
 * @returns {User[]} - user instances.
 */
export function mapUsers(queryResult: Ref<Record<string, unknown>[]>): User[] {
  const records = queryResult.value ?? [];
  return records.map((record) => mapUser(record));
}

/**
 * Map user record to user instance.
 * @param {Record<string, unknown>} record - user record.
 * @returns {User} - user instance.
 */
export function mapUser(record: Record<string, unknown>): User {
  return new User(
    record.role as ROLE,
    record.uuid as string,
    record.fullName as string,
    record.username as string,
    mapAddress(record.address as Record<string, unknown>),
    record.phone as string,
    record.email as string,
    new Date(record.birthdate as string),
  )
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
