import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { ImageService } from './image.service';
import { LoggedIn, Public } from '../auth/authentication.decorator';
import Image from './entities/image.entity';
import { GetImageArgs } from './dto/args/get-image.args';
import { GetImageForFileArgs } from './dto/args/get-image-for-file.args';
import { DeleteImageInput } from './dto/input/delete-image.input';
import { CreateImageInput } from './dto/input/create-image.input';

@Resolver(() => Image)
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Public()
  @Query(() => Image, { name: 'image' })
  async getImage(@Args() getImageArgs: GetImageArgs): Promise<Image> {
    return this.imageService.getImage(getImageArgs);
  }

  @Public()
  @Query(() => Image, { name: 'imageForFile' })
  async getImageForFile(
    @Args() getImageForFileArgs: GetImageForFileArgs,
  ): Promise<Image> {
    return this.imageService.getImageForFile(getImageForFileArgs);
  }

  @LoggedIn() // TODO application specific: set appropriate guards here
  @Mutation(() => Image)
  async deleteImage(
    @Args('deleteImageInput') deleteImageInput: DeleteImageInput,
  ): Promise<Image> {
    return this.imageService.deleteImage(deleteImageInput);
  }

  @LoggedIn() // TODO application specific: set appropriate guards here
  @Mutation(() => Image)
  async createImage(
    @Args('createImageInput') createImageInput: CreateImageInput,
  ): Promise<Image> {
    return this.imageService.createImage(createImageInput);
  }
}
