import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities/company.entity';
import { Employee } from './entities/employee.entity';
import { CompanyService } from '../company/company.service';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Employee]), CompanyModule],
  providers: [EmployeeResolver, EmployeeService, CompanyService],
})
export class EmployeeModule {}
