import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from './entities/public_file.entity';
import { ConfigService } from '@nestjs/config';
import { FileResolver } from './file.resolver';
import { PrivateFile } from './entities/private_file.entity';
import { Company } from '../company/entities/company.entity';
import { User } from '../user/entities/user.entity';
import { Offer } from '../offer/entities/offer.entity';
import { Dossier } from '../dossier/entity/dossier.entity';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { Bank } from '../bank/entities/bank.entity';
import { SoiEmployee } from '../SOI-Employee/entities/soi-employee.entity';
import { Employee } from '../employee/entities/employee.entity';
import { CompanyService } from '../company/company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PublicFile,
      PrivateFile,
      Company,
      User,
      Offer,
      Dossier,
      Bank,
      SoiEmployee,
      Employee,
    ]),
  ],
  providers: [
    FileService,
    ConfigService,
    FileResolver,
    UserService,
    EmployeeService,
    CompanyService,
  ],
  controllers: [FileController],
})
export class FileModule {}
