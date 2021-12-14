import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dossier } from './entity/dossier.entity';
import {CreateDossierInput} from "./dto/input/create-dossier.input";
import {UpdateDossierStatusInput} from "./dto/input/update-dossier-status.input";
import {STATUS} from "../../ENUM/ENUMS";

@Injectable()
export class DossierService {
  constructor(
    @InjectRepository(Dossier) private dossierRepository: Repository<Dossier>,
  ) {}

  /**
   * Creates a new dossier using the given data, and sets default values
   * @param {CreateDossierInput} createDossierInput - the dossier's data, containing all mandatory fields
   * @returns {Promise<Dossier>} - dossier
   */
  async createDossier(
    createDossierInput: CreateDossierInput,
  ): Promise<Dossier> {

    const dossier = this.dossierRepository.create({
      ...createDossierInput,
      offers: [],
      status: STATUS.CREATED,
      // TODO: other default values
    });

    return await this.dossierRepository.save(dossier);
  }

  async updateDossier(updateDossierStatusInput: UpdateDossierStatusInput): Promise<Dossier> {
    await this.dossierRepository.update(updateDossierStatusInput.uuid, {status: updateDossierStatusInput.status});
    return this.dossierRepository.findOne(updateDossierStatusInput.status)
  }
}
