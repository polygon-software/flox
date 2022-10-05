import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImageService } from './image.service';
import { LoggedIn } from '../auth/authentication.decorator';
import Image from './entities/image.entity';
import { GetImageArgs } from './dto/args/get-image.args';
import { GetImageForFileArgs } from './dto/args/get-image-for-file.args';
import { DeleteImageInput } from './dto/input/delete-image.input';
import { CreateImageInput } from './dto/input/create-image.input';
import { CurrentUser } from '../roles/authorization.decorator';
import { User } from '../auth/entities/user.entity';
import { DEFAULT_ROLES } from '../roles/config';
import { ForbiddenError } from 'apollo-server-express';
import { FileService } from '../file/file.service';

@Resolver(() => Image)
export class ImageResolver {
  constructor(
    private readonly imageService: ImageService,
    private readonly fileService: FileService,
  ) {}

  @LoggedIn()
  @Query(() => Image, { name: 'image' })
  async getImage(
    @Args() getImageArgs: GetImageArgs,
    @CurrentUser() user: User,
  ): Promise<Image> {
    const image = await this.imageService.getImage(getImageArgs);
    if (user.role !== DEFAULT_ROLES.ADMIN && image.file.owner !== user.uuid) {
      throw new ForbiddenError('Image does not belong to logged in user');
    }
    return image;
  }

  @LoggedIn()
  @Query(() => Image, { name: 'imageForFile' })
  async getImageForFile(
    @Args() getImageForFileArgs: GetImageForFileArgs,
    @CurrentUser() user: User,
  ): Promise<Image> {
    const image = await this.imageService.getImageForFile(
      getImageForFileArgs,
      user,
    );
    if (user.role !== DEFAULT_ROLES.ADMIN && image.file.owner !== user.uuid) {
      throw new ForbiddenError('Image does not belong to logged in user');
    }
    return image;
  }

  @LoggedIn() // TODO application specific: set appropriate guards here
  @Mutation(() => Image)
  async createImage(
    @Args('createImageInput') createImageInput: CreateImageInput,
    @CurrentUser() user: User,
  ): Promise<Image> {
    const file = await this.fileService.getPrivateFile({
      uuid: createImageInput.file,
    });
    if (user.role !== DEFAULT_ROLES.ADMIN && file.owner !== user.uuid) {
      throw new ForbiddenError('Image does not belong to logged in user');
    }
    return this.imageService.createImage(createImageInput, user);
  }

  @LoggedIn() // TODO application specific: set appropriate guards here
  @Mutation(() => Image)
  async deleteImage(
    @Args('deleteImageInput') deleteImageInput: DeleteImageInput,
    @CurrentUser() user: User,
  ): Promise<Image> {
    const image = await this.imageService.getImage({
      uuid: deleteImageInput.uuid,
    } as GetImageArgs);
    if (user.role !== DEFAULT_ROLES.ADMIN && image.file.owner !== user.uuid) {
      throw new ForbiddenError('Image does not belong to logged in user');
    }
    return this.imageService.deleteImage(deleteImageInput);
  }
}
