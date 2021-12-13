import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dossier } from './entity/dossier.entity';
import {DossierResolver} from "./dossier.resolver";
import {DossierService} from "./dossier.service";

@Module({
  imports: [TypeOrmModule.forFeature([Dossier])],
  providers: [DossierResolver, DossierService],
})
export class DossierModule {}
