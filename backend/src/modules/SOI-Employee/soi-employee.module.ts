import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoiEmployeeService } from './soi-employee.service';
import { SoiEmployeeResolver } from './soi-employee.resolver';
import { SoiEmployee } from './entities/soi-employee.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SoiEmployee, User]), UserModule],
  providers: [SoiEmployeeService, SoiEmployeeResolver],
})
export class SoiEmployeeModule {}
