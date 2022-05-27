import { CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 * Defines authentication-specific decorators
 */

export const IS_PUBLIC_KEY = 'isPublic';

// Allow public access
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
