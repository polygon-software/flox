import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dossier } from './entity/dossier.entity';
import { DossierResolver } from './dossier.resolver';
import { DossierService } from './dossier.service';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Offer } from '../offer/entities/offer.entity';
import { EmployeeModule } from '../employee/employee.module';
import { BankModule } from '../bank/bank.module';
import { FileModule } from '../file/file.module';
import { Address } from '../address/entities/address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dossier, User, Offer, Address]),
    UserModule,
    EmployeeModule,
    BankModule,
    FileModule,
  ],
  providers: [DossierResolver, DossierService],
  exports: [DossierService],
})
export class DossierModule {}
