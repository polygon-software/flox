import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SoiEmployee } from '../SOI-Employee/entities/soi-employee.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Company } from '../company/entities/company.entity';
import { Bank } from '../bank/entities/bank.entity';
import { EmployeeService } from '../employee/employee.service';
import { CompanyService } from '../company/company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Bank, SoiEmployee, Employee, Company]),
  ],
  providers: [UserResolver, UserService, CompanyService, EmployeeService],
})
export class UserModule {}
