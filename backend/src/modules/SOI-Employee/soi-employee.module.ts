import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoiEmployeeService } from './soi-employee.service';
import { SoiEmployeeResolver } from './soi-employee.resolver';
import { SoiEmployee } from './entities/soi-employee.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { Company } from '../company/entities/company.entity';
import { Bank } from '../bank/entities/bank.entity';
import { Employee } from '../employee/entities/employee.entity';
import { CompanyService } from '../company/company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SoiEmployee,
      User,
      Company,
      Bank,
      SoiEmployee,
      Employee,
    ]),
  ],
  providers: [
    SoiEmployeeService,
    SoiEmployeeResolver,
    UserService,
    EmployeeService,
    CompanyService,
  ],
})
export class SoiEmployeeModule {}
