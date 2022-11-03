import { Cookies } from 'quasar';

export const ALIAS_COOKIE_NAME = 'authentication.alias';

export function getAlias(): string {
  return Cookies.get(ALIAS_COOKIE_NAME);
}

export function setAlias(aliasUuid: string): void {
  Cookies.set(ALIAS_COOKIE_NAME, aliasUuid);
}

export function unsetAlias(): void {
  Cookies.remove(ALIAS_COOKIE_NAME);
}
