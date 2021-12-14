import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { SoiAdmin } from './entities/soi-admin.entity';
import { CreateSoiAdminInput } from './dto/input/create-soi-admin.input';
import { createCognitoAccount, randomPassword } from '../../auth/authService';
import { sendPasswordChangeEmail } from '../../email/helper';
import { ROLE } from '../../ENUM/ENUMS';

@Injectable()
export class SoiAdminService {
  constructor(
    @InjectRepository(SoiAdmin)
    private soiAdminRepository: Repository<SoiAdmin>,
    private userService: UserService,
  ) {}

  /**
   * Create a new SOI Admin
   * @param {CreateSoiAdminInput} createSoiAdminInput - necessary input to create an soi admin
   * @returns {Promise<SoiAdmin>} - SOI Admin
   */
  async createSoiAdmin(
    createSoiAdminInput: CreateSoiAdminInput,
  ): Promise<SoiAdmin> {
    // Create a Cognito account with a random password
    const password = randomPassword(8);
    const cognitoId = await createCognitoAccount(
      createSoiAdminInput.email,
      password,
    );

    // Send password reset email with the current password embedded
    await sendPasswordChangeEmail(
      createSoiAdminInput.email,
      password,
      ROLE.SOI_ADMIN,
    );

    // Create the SoiAdmin and User in the database
    const soiAdmin = this.soiAdminRepository.create(createSoiAdminInput);
    await this.userService.create({
      role: ROLE.SOI_ADMIN,
      uuid: cognitoId,
      fk: soiAdmin.uuid,
    });
    return this.soiAdminRepository.save(soiAdmin);
  }
}
