/* eslint-disable @typescript-eslint/naming-convention */

import { registerEnumType } from '@nestjs/graphql';

/**
 * Defines how the password is delivered to the user after an admin created the user.
 */
enum DELIVERY_MEDIUMS {
  CUSTOM_EMAIL = 'CUSTOM_EMAIL',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

registerEnumType(DELIVERY_MEDIUMS, { name: 'DeliveryMediums' });
export default DELIVERY_MEDIUMS;
