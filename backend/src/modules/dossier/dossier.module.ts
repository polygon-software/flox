import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dossier } from './entity/dossier.entity';
import { DossierResolver } from './dossier.resolver';
import { DossierService } from './dossier.service';
import { Bank } from '../bank/entities/bank.entity';
import { BankService } from '../bank/bank.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dossier, Bank, User, Employee])],
  providers: [
    DossierResolver,
    DossierService,
    BankService,
    UserService,
    EmployeeService,
  ],
})
export class DossierModule {}
