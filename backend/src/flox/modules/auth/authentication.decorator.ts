import { CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 * Defines authentication-specific decorators
 */

export const IS_PUBLIC_KEY = 'isPublic';
export const LOGGED_IN_KEY = 'loggedIn';
export const IS_BASIC_AUTHENTICATED_KEY = 'isBasicAuthenticated';

// Allow public access
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);

// Allow access to anyone that is logged in (without considering any roles)
export const LoggedIn = (): CustomDecorator => SetMetadata(LOGGED_IN_KEY, true);

// Allows access to the ERP API endpoints, if credentials are correct
export const BasicAuth = (): CustomDecorator =>
  SetMetadata(IS_BASIC_AUTHENTICATED_KEY, true);
