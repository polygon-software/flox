import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dossier } from './entity/dossier.entity';
import { DossierResolver } from './dossier.resolver';
import { DossierService } from './dossier.service';
import { Bank } from '../bank/entities/bank.entity';
import { BankService } from '../bank/bank.service';
import { User } from '../user/entities/user.entity';
import { Employee } from '../employee/entities/employee.entity';
import { CompanyService } from '../company/company.service';
import { Company } from '../company/entities/company.entity';
import { Offer } from '../offer/entities/offer.entity';
import { FileService } from '../file/file.service';
import PrivateFile from '../file/entities/private_file.entity';
import PublicFile from '../file/entities/public_file.entity';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { SoiEmployee } from '../SOI-Employee/entities/soi-employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dossier,
      Bank,
      User,
      Employee,
      Company,
      Offer,
      PrivateFile,
      PublicFile,
      SoiEmployee,
    ]),
  ],
  providers: [
    DossierResolver,
    DossierService,
    BankService,
    FileService,
    CompanyService,
    FileService,
    UserService,
    EmployeeService,
  ],
})
export class DossierModule {}
