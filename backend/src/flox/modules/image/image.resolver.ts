import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImageService } from './image.service';
import { LoggedIn } from '../auth/authentication.decorator';
import Image from './entities/image.entity';
import { GetImageArgs } from './dto/args/get-image.args';
import { GetImageForFileArgs } from './dto/args/get-image-for-file.args';
import { DeleteImageInput } from './dto/input/delete-image.input';
import { CreateImageInput } from './dto/input/create-image.input';
import { AdminOnly, CurrentUser } from '../roles/authorization.decorator';
import { User } from '../auth/entities/user.entity';
import { DEFAULT_ROLES } from '../roles/config';
import { ForbiddenError } from 'apollo-server-express';
import { FileService } from '../file/file.service';
import { GetAllImagesArgs } from './dto/args/get-all-images.args';
import { AbstractSearchResolver } from '../abstracts/search/abstract-search.resolver';
import { GetOneArgs } from '../abstracts/crud/dto/get-one.args';

@Resolver(() => Image)
export class ImageResolver extends AbstractSearchResolver<Image, ImageService> {
  constructor(
    private readonly imageService: ImageService,
    private readonly fileService: FileService,
  ) {
    super('capturedAt');
  }

  get service(): ImageService {
    return this.imageService;
  }

  /**
   * Returns an Image that wraps a s3 bucket file
   * @param getImageArgs - contains uuid of image
   * @param user - Currently logged-in user
   * @returns Requested image
   */
  @LoggedIn()
  @Query(() => Image, { name: 'image' })
  async getImage(@Args() getImageArgs: GetImageArgs): Promise<Image> {
    return this.imageService.getImage(getImageArgs);
  }

  /**
   * Returns all images stored in database. Only accessible to admins
   * @param getAllImagesArgs - take and skip parameters
   * @returns All Images
   */
  @AdminOnly()
  @Query(() => [Image], { name: 'images' })
  async getImages(getAllImagesArgs: GetAllImagesArgs): Promise<Image[]> {
    return this.imageService.getAllImages(getAllImagesArgs);
  }

  /**
   * Gets the image wrapper for a specified file. Useful if you know the file but not the
   * corresponding image wrapper
   * @param getImageForFileArgs - contains the uuid of the file
   * @param user - Currently logged-in user
   * @returns Requested image
   */
  @LoggedIn()
  @Query(() => Image, { name: 'imageForFile' })
  async getImageForFile(
    @Args() getImageForFileArgs: GetImageForFileArgs,
    @CurrentUser() user: User,
  ): Promise<Image> {
    const image = await this.imageService.getImageForFile(getImageForFileArgs);
    if (
      user.role !== DEFAULT_ROLES.ADMIN &&
      image.file.owner.uuid !== user.uuid
    ) {
      throw new ForbiddenError('File does not belong to logged in user');
    }
    return image;
  }

  /**
   * Creates a new image for an already existing file
   * @param createImageInput - contains uuid of file to wrap
   * @param user - Currently logged-in user
   * @returns Requested image
   */
  @LoggedIn()
  @Mutation(() => Image)
  async createImage(
    @Args('createImageInput') createImageInput: CreateImageInput,
    @CurrentUser() user: User,
  ): Promise<Image> {
    const file = await this.fileService.getOneAsUser(
      {
        uuid: createImageInput.file,
      } as GetOneArgs,
      user,
    );
    if (user.role !== DEFAULT_ROLES.ADMIN && file.owner.uuid !== user.uuid) {
      throw new ForbiddenError(
        'Cannot create image for file that belongs to someone else',
      );
    }
    return this.imageService.createImage(createImageInput);
  }

  /**
   * Deletes an image (without deleting the corresponding file)
   * @param deleteImageInput - contains uuid of image
   * @param user - Currently logged-in user
   * @returns Requested image
   */
  @LoggedIn()
  @Mutation(() => Image)
  async deleteImage(
    @Args('deleteImageInput') deleteImageInput: DeleteImageInput,
    @CurrentUser() user: User,
  ): Promise<Image> {
    const image = await this.imageService.getImage({
      uuid: deleteImageInput.uuid,
    } as GetImageArgs);
    if (
      user.role !== DEFAULT_ROLES.ADMIN &&
      image.file.owner.uuid !== user.uuid
    ) {
      throw new ForbiddenError('Image does not belong to logged in user');
    }
    return this.imageService.deleteImage(deleteImageInput);
  }
}
