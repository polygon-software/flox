/* eslint-disable @typescript-eslint/naming-convention */

import { registerEnumType } from '@nestjs/graphql';

enum DELIVERY_MEDIUMS {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

registerEnumType(DELIVERY_MEDIUMS, { name: 'DeliveryMediums' });
export default DELIVERY_MEDIUMS;
