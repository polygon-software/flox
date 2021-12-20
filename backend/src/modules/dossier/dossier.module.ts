import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dossier } from './entity/dossier.entity';
import { DossierResolver } from './dossier.resolver';
import { DossierService } from './dossier.service';
import { Bank } from '../bank/entities/bank.entity';
import { BankService } from '../bank/bank.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dossier, Bank])],
  providers: [DossierResolver, DossierService, BankService],
})
export class DossierModule {}
