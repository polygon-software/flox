import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dossier } from './entity/dossier.entity';
import { CreateDossierInput } from './dto/input/create-dossier.input';
import { UpdateDossierInput } from './dto/input/update-dossier.input';
import { STATUS } from '../../ENUM/ENUMS';

@Injectable()
export class DossierService {
  constructor(
    @InjectRepository(Dossier) private dossierRepository: Repository<Dossier>,
  ) {}

  /**
   * Creates a new dossier using the given data, and sets default values
   * @param {CreateDossierInput} createDossierInput - the dossier's data, containing all mandatory fields
   * @async
   * @returns {Dossier} - dossier
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

  /**
   * Updates a dossier using with the given data
   * @param {UpdateDossierInput} updateDossierInput - the dossier's data, containing all mandatory fields
   * @async
   * @returns {Dossier} - dossier
   */
  async updateDossier(
    updateDossierInput: UpdateDossierInput,
  ): Promise<Dossier> {
    await this.dossierRepository.update(updateDossierInput.uuid, {
      status: updateDossierInput.status,
    });
    return this.dossierRepository.findOne(updateDossierInput.status);
  }
}
