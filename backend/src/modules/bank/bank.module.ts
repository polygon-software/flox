import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { BankResolver } from './bank.resolver';
import { BankService } from './bank.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { SoiEmployee } from '../SOI-Employee/entities/soi-employee.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Company } from '../company/entities/company.entity';
import { EmployeeService } from '../employee/employee.service';
import { CompanyService } from '../company/company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bank, User, SoiEmployee, Employee, Company]),
  ],
  providers: [
    BankResolver,
    BankService,
    UserService,
    EmployeeService,
    CompanyService,
  ],
})
export class BankModule {}
