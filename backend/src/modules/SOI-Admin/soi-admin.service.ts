import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { SoiAdmin } from './entities/soi-admin.entity';
import { CreateSoiAdminInput } from './dto/input/create-soi-admin.input';
import { createCognitoAccount, randomPassword } from '../../auth/authService';
import { sendPasswordChangeEmail } from '../../email/helper';
import { ROLES } from '../../ENUM/ENUMS';

@Injectable()
export class SoiAdminService {
  constructor(
    @InjectRepository(SoiAdmin)
    private soiAdminRepository: Repository<SoiAdmin>,
    private userService: UserService,
  ) {}

  /**
   * Create a new SOI Admin
   * @param createSoiAdminInput
   */
  async createSoiAdmin(
    createSoiAdminInput: CreateSoiAdminInput,
  ): Promise<SoiAdmin> {
    const password = randomPassword(8);
    const cognitoId = await createCognitoAccount(
      createSoiAdminInput.email,
      password,
    );
    await sendPasswordChangeEmail(
      createSoiAdminInput.email,
      password,
      ROLES.SOI_ADMIN,
    );
    const soiAdmin = this.soiAdminRepository.create(createSoiAdminInput);
    await this.userService.create({
      role: ROLES.SOI_ADMIN,
      uuid: cognitoId,
      fk: soiAdmin.uuid,
    });
    return this.soiAdminRepository.save(soiAdmin);
  }
}
