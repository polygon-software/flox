import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Address } from '../address/entities/address.entity';
import { Employee } from '../employee/entities/employee.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Address, Employee, User])],
  providers: [CompanyResolver, CompanyService, UserService],
})
export class CompanyModule {}
