import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { ImageService } from './image.service';
import { LoggedIn, Public } from '../auth/authentication.decorator';
import Image from './entities/image.entity';
import { GetImageArgs } from './dto/args/get-image.args';
import { GetImageForFileArgs } from './dto/args/get-image-for-file.args';
import { User } from '../auth/entities/user.entity';
import { DeleteImageInput } from './dto/input/delete-image.input';

@Resolver(() => Image)
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Public()
  @Query(() => Image, { name: 'getImage' })
  async getImage(@Args() getImageArgs: GetImageArgs): Promise<Image> {
    return this.imageService.getImage(getImageArgs);
  }

  @Public()
  @Query(() => Image, { name: 'getImageForFile' })
  async getImageForFile(
    @Args() getImageForFileArgs: GetImageForFileArgs,
  ): Promise<Image> {
    return this.imageService.getImageForFile(getImageForFileArgs);
  }

  @LoggedIn() // TODO application specific: set appropriate guards here
  @Mutation(() => User)
  async deleteImage(
    @Args('deleteImageInput') deleteImageInput: DeleteImageInput,
  ): Promise<Image> {
    return this.imageService.deleteImage(deleteImageInput);
  }
}
