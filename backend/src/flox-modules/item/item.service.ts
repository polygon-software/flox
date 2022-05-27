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

  async create(createItemInput: CreateItemInput): Promise<Item> {
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

  findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  findOne(uuid: string): Promise<Item> {
    return this.itemRepository.findOne(uuid);
  }

  async update(uuid: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = this.itemRepository.create(updateItemInput);
    await this.itemRepository.update(updateItemInput.uuid, item);
    return this.itemRepository.findOne(updateItemInput.uuid);
  }

  async remove(uuid: string): Promise<Item> {
    const item = await this.itemRepository.findOne(uuid);
    return this.itemRepository.remove(item);
  }
}
