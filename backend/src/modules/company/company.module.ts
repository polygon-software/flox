import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Address } from '../address/entities/address.entity';
import { Employee } from '../employee/entities/employee.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { SoiEmployee } from '../SOI-Employee/entities/soi-employee.entity';
import { Bank } from '../bank/entities/bank.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Address,
      Employee,
      User,
      SoiEmployee,
      Bank,
    ]),
  ],
  providers: [CompanyResolver, CompanyService, UserService, EmployeeService],
})
export class CompanyModule {}
