import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../auth/entities/user.entity';
import AbstractCrudService from '../abstracts/crud/abstract-crud.service';

import UserGroup from './entities/user-group.entity';

@Injectable()
export default class AccessControlService extends AbstractCrudService<UserGroup> {
  constructor(
    @InjectRepository(UserGroup)
    private userGroupRepository: Repository<UserGroup>,
  ) {
    super();
  }

  get repository(): Repository<UserGroup> {
    return this.userGroupRepository;
  }

  async getUserGroupsForUser(user: User): Promise<UserGroup[]> {
    return this.userGroupRepository.find({
      where: {
        users: {
          uuid: user.uuid,
        },
      },
    });
  }

  async addUserToUserGroup(
    userGroupUuid: string,
    user: User,
  ): Promise<UserGroup> {
    const userGroup = await this.userGroupRepository.findOneOrFail({
      relations: {
        users: true,
      },
      where: {
        uuid: userGroupUuid,
      },
    });
    if (userGroup.users.find((u) => u.uuid === user.uuid)) {
      return userGroup;
    }
    userGroup.users.push(user);
    return this.userGroupRepository.save(userGroup);
  }

  async removeUserFromGroup(
    userGroupUuid: string,
    user: User,
  ): Promise<UserGroup> {
    const userGroup = await this.userGroupRepository.findOneOrFail({
      relations: {
        users: true,
      },
      where: {
        uuid: userGroupUuid,
      },
    });
    userGroup.users = userGroup.users.filter((u) => u.uuid !== user.uuid);
    return this.userGroupRepository.save(userGroup);
  }
}
