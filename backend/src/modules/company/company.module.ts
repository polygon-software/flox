import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Address } from '../address/entities/address.entity';
import { Employee } from '../employee/entities/employee.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { FileService } from '../file/file.service';
import PrivateFile from '../file/entities/private_file.entity';
import PublicFile from '../file/entities/public_file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Address,
      Employee,
      User,
      PrivateFile,
      PublicFile,
    ]),
  ],
  providers: [CompanyResolver, CompanyService, UserService, FileService],
})
export class CompanyModule {}
