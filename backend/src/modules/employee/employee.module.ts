import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities/company.entity';
import { Employee } from './entities/employee.entity';
import { CompanyService } from '../company/company.service';
import { User } from '../user/entities/user.entity';
import { Dossier } from '../dossier/entity/dossier.entity';
import { FileService } from '../file/file.service';
import PrivateFile from '../file/entities/private_file.entity';
import PublicFile from '../file/entities/public_file.entity';
import { Offer } from '../offer/entities/offer.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Employee,
      User,
      Company,
      PrivateFile,
      PublicFile,
      Dossier,
      Offer,
    ]),
    UserModule,
  ],
  providers: [
    EmployeeResolver,
    EmployeeService,
    CompanyService,
    CompanyService,
    FileService,
  ],
})
export class EmployeeModule {}
