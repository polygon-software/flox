import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dossier } from './entity/dossier.entity';
import {UpdateDossierStatus} from "./dto/input/update-dossier.input";

@Injectable()
export class DossierService {
  constructor(
    @InjectRepository(Dossier) private dossierRepository: Repository<Dossier>,
  ) {}

  async update(updateDossierStatus: UpdateDossierStatus): Promise<Dossier> {
    await this.dossierRepository.update(updateDossierStatus.uuid, {status: updateDossierStatus.status});
    return this.dossierRepository.findOne(updateDossierStatus.status)
  }
}
