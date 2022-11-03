import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../auth/entities/user.entity';
import GetAllArgs from '../abstracts/crud/dto/get-all.args';
import AbstractSearchService from '../abstracts/search/abstract-search.service';

import UserGroup from './entities/user-group.entity';

@Injectable()
export default class AccessControlService extends AbstractSearchService<UserGroup> {
  constructor(
    @InjectRepository(UserGroup)
    private userGroupRepository: Repository<UserGroup>,
  ) {
    super();
  }

  get repository(): Repository<UserGroup> {
    return this.userGroupRepository;
  }

  async getUserGroupsForUser(
    userUuid: string,
    getAll: GetAllArgs,
  ): Promise<UserGroup[]> {
    return this.userGroupRepository.find({
      relations: {
        users: true,
      },
      where: {
        users: {
          uuid: userUuid,
        },
      },
      take: getAll.take,
      skip: getAll.skip,
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
    await this.userGroupRepository.save(userGroup);
    return this.getOne(
      { uuid: userGroup.uuid },
      { relations: { users: true } },
    );
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
    await this.userGroupRepository.save(userGroup);
    return this.getOne(
      { uuid: userGroup.uuid },
      { relations: { users: true } },
    );
  }
}
