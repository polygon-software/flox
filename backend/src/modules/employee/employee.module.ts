import { forwardRef, Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    forwardRef(() => UserModule),
    CompanyModule,
  ],
  providers: [EmployeeResolver, EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
