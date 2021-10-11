import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GlobiService } from './globi.service';
import { Globi } from './entities/globi.entity';
import { CreateGlobiInput } from './dto/create-globi.input';
import { UpdateGlobiInput } from './dto/update-globi.input';

@Resolver(() => Globi)
export class GlobiResolver {
  constructor(private readonly globiService: GlobiService) {}

  @Mutation(() => Globi)
  createGlobi(@Args('createGlobiInput') createGlobiInput: CreateGlobiInput) {
    return this.globiService.create(createGlobiInput);
  }

  @Query(() => [Globi], { name: 'globi' })
  findAll() {
    return this.globiService.findAll();
  }

  @Query(() => Globi, { name: 'globi' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.globiService.findOne(id);
  }

  @Mutation(() => Globi)
  updateGlobi(@Args('updateGlobiInput') updateGlobiInput: UpdateGlobiInput) {
    return this.globiService.update(updateGlobiInput.id, updateGlobiInput);
  }

  @Mutation(() => Globi)
  removeGlobi(@Args('id', { type: () => Int }) id: number) {
    return this.globiService.remove(id);
  }
}
