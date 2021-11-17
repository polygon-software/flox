import { Injectable } from '@nestjs/common';
import { CreateCompanyInput } from './dto/input/create-company.input';
import { UpdateCompanyInput } from './dto/input/update-company.input';
import { GetCompanyArgs } from './dto/args/get-company.args';
import { GetCompaniesArgs } from './dto/args/get-companies.args';
import { DeleteCompanyInput } from './dto/input/delete-company.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateCompanyInput): Promise<User> {
    const user = await this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  getUsers(getUsersArgs: GetCompaniesArgs): Promise<User[]> {
    if (getUsersArgs.uuids !== undefined) {
      return this.usersRepository.findByIds(getUsersArgs.uuids);
    } else {
      return this.usersRepository.find();
    }
  }

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  getUser(getUserArgs: GetCompanyArgs): Promise<User> {
    return this.usersRepository.findOne(getUserArgs.uuid);
  }

  async update(updateUserInput: UpdateCompanyInput): Promise<User> {
    const user = await this.usersRepository.create(updateUserInput);
    await this.usersRepository.update(updateUserInput.uuid, user);
    return this.usersRepository.findOne(updateUserInput.uuid);
  }

  async remove(deleteUserInput: DeleteCompanyInput): Promise<User> {
    const user = await this.usersRepository.findOne(deleteUserInput.uuid);
    const uuid = user.uuid;
    const deleted_user = await this.usersRepository.remove(user);
    deleted_user.uuid = uuid;
    return deleted_user;
  }
}
