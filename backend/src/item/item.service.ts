import { Injectable } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createItemInput: CreateItemInput) {
    let item;
    if (
      createItemInput.userUUID !== null &&
      createItemInput.userUUID !== undefined
    ) {
      const user = await this.userRepository.findOne(createItemInput.userUUID);
      item = this.itemRepository.create({ ...createItemInput, user: user });
    } else {
      item = this.itemRepository.create({ ...createItemInput });
    }
    item = await this.itemRepository.save(item);
    return this.itemRepository.findOne(item.uuid, { relations: ['user'] });
  }

  findAll() {
    return this.itemRepository.find();
  }

  findOne(uuid: string) {
    return this.itemRepository.findOne(uuid);
  }

  update(uuid: string, updateItemInput: UpdateItemInput) {
    const item = this.itemRepository.create(updateItemInput);
    return this.itemRepository.update(updateItemInput.uuid, item);
  }

  async remove(uuid: string) {
    const item = await this.itemRepository.findOne(uuid);
    return this.itemRepository.remove(item);
  }
}
