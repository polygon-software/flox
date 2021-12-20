import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities/company.entity';
import { Employee } from './entities/employee.entity';
import { CompanyService } from '../company/company.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Dossier } from '../dossier/entity/dossier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Employee, User, Dossier])],
  providers: [EmployeeResolver, EmployeeService, CompanyService, UserService],
})
export class EmployeeModule {}
