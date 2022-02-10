import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SoiEmployee } from '../SOI-Employee/entities/soi-employee.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Company } from '../company/entities/company.entity';
import { Bank } from '../bank/entities/bank.entity';
import { EmployeeModule } from '../employee/employee.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SoiEmployee, Employee, Company, Bank]),
    forwardRef(() => EmployeeModule),
    forwardRef(() => CompanyModule),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
