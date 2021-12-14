import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { SoiEmployeeService } from './soi-employee.service';
import { SoiEmployeeResolver } from './soi-employee.resolver';
import { SoiEmployee } from './entities/soi-employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SoiEmployee])],
  providers: [SoiEmployeeService, SoiEmployeeResolver, UserService],
})
export class SoiEmployeeModule {}
