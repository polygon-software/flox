import { Resolver } from '@nestjs/graphql';
import { Address } from './entities/address.entity';

@Resolver(() => Address)
export class AddressResolver {}
