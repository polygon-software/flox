import { Cookies } from 'quasar';

export const ALIAS_COOKIE_NAME = 'authentication.alias';

/**
 * Returns the currently set alias
 *
 * @returns uuid of currently set alias or empty string
 */
export function getAlias(): string {
  return Cookies.get(ALIAS_COOKIE_NAME);
}

/**
 * Sets a new alias as a cookie
 *
 * @param aliasUuid - uuid of user that shall be aliased
 */
export function setAlias(aliasUuid: string): void {
  Cookies.set(ALIAS_COOKIE_NAME, aliasUuid);
}

/**
 * Removes any set alias
 */
export function unsetAlias(): void {
  Cookies.remove(ALIAS_COOKIE_NAME);
}
