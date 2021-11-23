import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';

@Module({
  providers: [EmployeeResolver, EmployeeService]
})
export class EmployeeModule {}
