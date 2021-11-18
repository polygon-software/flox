import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Address } from './entities/address.entity';
import { AddressResolver } from './address.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Address])],
  providers: [CompanyResolver, CompanyService, AddressResolver],
})
export class CompanyModule {}
