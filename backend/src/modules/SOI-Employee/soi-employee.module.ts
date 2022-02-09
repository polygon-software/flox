import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoiEmployeeService } from './soi-employee.service';
import { SoiEmployeeResolver } from './soi-employee.resolver';
import { SoiEmployee } from './entities/soi-employee.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SoiEmployee]), UserModule],
  providers: [SoiEmployeeService, SoiEmployeeResolver],
  exports: [SoiEmployeeService],
})
export class SoiEmployeeModule {}
