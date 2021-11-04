import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Public } from '../auth/auth.guard';

@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Public()
  @Mutation(() => Item)
  createItem(@Args('createItemInput') createItemInput: CreateItemInput) {
    return this.itemService.create(createItemInput);
  }

  @Public()
  @Query(() => [Item], { name: 'items' })
  findAll() {
    return this.itemService.findAll();
  }

  @Public()
  @Query(() => Item, { name: 'item' })
  findOne(@Args('uuid', { type: () => ID }) uuid: string) {
    return this.itemService.findOne(uuid);
  }

  @Public()
  @Mutation(() => Item)
  updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput) {
    return this.itemService.update(updateItemInput.uuid, updateItemInput);
  }

  @Public()
  @Mutation(() => Item)
  removeItem(@Args('uuid', { type: () => ID }) uuid: string) {
    return this.itemService.remove(uuid);
  }
}
