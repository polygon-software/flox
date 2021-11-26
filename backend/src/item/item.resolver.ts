import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Public } from '../auth/authentication.decorator';

@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Public()
  @Mutation(() => Item)
  createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
  ): Promise<Item> {
    return this.itemService.create(createItemInput);
  }

  @Public()
  @Query(() => [Item], { name: 'items' })
  findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Public()
  @Query(() => Item, { name: 'item' })
  findOne(@Args('uuid', { type: () => ID }) uuid: string): Promise<Item> {
    return this.itemService.findOne(uuid);
  }

  @Public()
  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
  ): Promise<Item> {
    return this.itemService.update(updateItemInput.uuid, updateItemInput);
  }

  @Public()
  @Mutation(() => Item)
  removeItem(@Args('uuid', { type: () => ID }) uuid: string): Promise<Item> {
    return this.itemService.remove(uuid);
  }
}
