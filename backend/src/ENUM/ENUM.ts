import { registerEnumType } from '@nestjs/graphql';
import {
  CATEGORY,
  CURRENCY,
  PRODUCT_STATUS,
} from '../../../shared/definitions/ENUM';

registerEnumType(CURRENCY, { name: 'Currency' });
registerEnumType(CATEGORY, { name: 'Category' });
registerEnumType(PRODUCT_STATUS, { name: 'ProductStatus' });
