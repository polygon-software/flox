import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AbstractSearchAccessControlResolver } from '../abstracts/search-access-control/abstract-search-access-control.resolver';
import { LoggedIn } from '../auth/authentication.decorator';
import { User } from '../auth/entities/user.entity';
import { FileService } from '../file/file.service';
import { AdminOnly, CurrentUser } from '../roles/authorization.decorator';

import { GetAllImagesArgs } from './dto/args/get-all-images.args';
import { GetImageArgs } from './dto/args/get-image.args';
import { GetImageForFileArgs } from './dto/args/get-image-for-file.args';
import { CreateImageInput } from './dto/input/create-image.input';
import { DeleteImageInput } from './dto/input/delete-image.input';
import Image from './entities/image.entity';
import { ImageService } from './image.service';

@Resolver(() => Image)
export class ImageResolver extends AbstractSearchAccessControlResolver<
  Image,
  ImageService
> {
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
  async getImage(
    @Args() getImageArgs: GetImageArgs,
    @CurrentUser() user: User,
  ): Promise<Image> {
    return this.imageService.getImage(getImageArgs, user);
  }

  /**
   * Returns all images stored in database. Only accessible to admins
   * @param getAllImagesArgs - take and skip parameters
   * @param user - Currently logged-in user
   * @returns All Images
   */
  @AdminOnly()
  @Query(() => [Image], { name: 'images' })
  async getImages(
    getAllImagesArgs: GetAllImagesArgs,
    @CurrentUser() user: User,
  ): Promise<Image[]> {
    return this.imageService.getAllImages(getAllImagesArgs, user);
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
    return await this.imageService.getImageForFile(getImageForFileArgs, user);
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
    return this.imageService.createImage(createImageInput, user);
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
    return this.imageService.deleteImage(deleteImageInput, user);
  }
}
