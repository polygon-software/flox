import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoiAdmin } from './entities/soi-admin.entity';
import { SoiAdminService } from './soi-admin.service';
import { SoiAdminResolver } from './soi-admin.resolver';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { Company } from '../company/entities/company.entity';
import { Bank } from '../bank/entities/bank.entity';
import { SoiEmployee } from '../SOI-Employee/entities/soi-employee.entity';
import { Employee } from '../employee/entities/employee.entity';
import { CompanyService } from '../company/company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SoiAdmin,
      User,
      Company,
      Bank,
      SoiEmployee,
      Employee,
    ]),
  ],
  providers: [
    SoiAdminService,
    SoiAdminResolver,
    UserService,
    EmployeeService,
    CompanyService,
  ],
})
/**
 * A SOI Admin Module
 */
export class SoiAdminModule {}
