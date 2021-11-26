import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Address } from '../address/entities/address.entity';
import { Employee } from '../employee/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Address, Employee])],
  providers: [CompanyResolver, CompanyService],
})
export class CompanyModule {}
