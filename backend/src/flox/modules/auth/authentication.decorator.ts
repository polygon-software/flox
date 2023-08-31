import { CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 * Defines authentication-specific decorators
 */

export const IS_PUBLIC_KEY = 'isPublic';
export const LOGGED_IN_KEY = 'loggedIn';

// Allow public access
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);

// Allow access to anyone that is logged in (without considering any roles)
export const LoggedIn = (): CustomDecorator => SetMetadata(LOGGED_IN_KEY, true);
