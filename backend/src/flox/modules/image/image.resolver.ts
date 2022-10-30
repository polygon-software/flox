import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import DeleteInput from '../abstracts/crud/inputs/delete.input';
import AbstractSearchAccessControlResolver from '../abstracts/search-access-control/abstract-search-access-control.resolver';
import { LoggedIn } from '../auth/authentication.decorator';
import User from '../auth/entities/user.entity';
import { CurrentUser } from '../roles/authorization.decorator';

import GetAllImagesArgs from './dto/args/get-all-images.args';
import GetImageArgs from './dto/args/get-image.args';
import GetImageForFileArgs from './dto/args/get-image-for-file.args';
import CreateImageInput from './dto/input/create-image.input';
import Image from './entities/image.entity';
import ImageService from './image.service';
import GetMultipleImagesArgs from './dto/args/get-multiple-images.args';
import SearchImagesArgs from './dto/args/search-images.args';
import ImageSearchOutput from './outputs/image-search.output';

@Resolver(() => Image)
export default class ImageResolver extends AbstractSearchAccessControlResolver<
  Image,
  ImageService
> {
  constructor(private readonly imageService: ImageService) {
    super('file.filename');
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
  @Query(() => Image, { name: 'Image' })
  async getImage(
    @Args() getImageArgs: GetImageArgs,
    @CurrentUser() user: User,
  ): Promise<Image> {
    return this.imageService.getImage(getImageArgs, user);
  }

  @LoggedIn()
  @Query(() => [Image], { name: 'Images' })
  async getImages(
    @Args() getMultipleImagesArgs: GetMultipleImagesArgs,
    @CurrentUser() user: User,
  ): Promise<Image[]> {
    return this.imageService.getMultipleImages(getMultipleImagesArgs, user);
  }

  @LoggedIn()
  @Query(() => [Image], { name: 'MyImages' })
  async getMyImages(
    @Args() getMultipleImagesArgs: GetMultipleImagesArgs,
    @CurrentUser() user: User,
  ): Promise<Image[]> {
    return this.imageService.getMultipleImagesOfUser(
      getMultipleImagesArgs,
      user,
    );
  }

  /**
   * Returns all images stored in database. Only accessible to admins
   * @param getAllImagesArgs - take and skip parameters
   * @param user - Currently logged-in user
   * @returns All Images
   */
  @LoggedIn()
  @Query(() => [Image], { name: 'AllImages' })
  async getAllImages(
    @Args() getAllImagesArgs: GetAllImagesArgs,
    @CurrentUser() user: User,
  ): Promise<Image[]> {
    return this.imageService.getAllImages(getAllImagesArgs, user);
  }

  @LoggedIn()
  @Query(() => [Image], { name: 'AllMyImages' })
  async getAllMyImages(
    @Args() getAllImagesArgs: GetAllImagesArgs,
    @CurrentUser() user: User,
  ): Promise<Image[]> {
    return this.imageService.getAllImagesOfUser(getAllImagesArgs, user);
  }

  /**
   * Gets the image wrapper for a specified file. Useful if you know the file but not the
   * corresponding image wrapper
   * @param getImageForFileArgs - contains the uuid of the file
   * @param user - Currently logged-in user
   * @returns Requested image
   */
  @LoggedIn()
  @Query(() => Image, { name: 'ImageForFile' })
  async getImageForFile(
    @Args() getImageForFileArgs: GetImageForFileArgs,
    @CurrentUser() user: User,
  ): Promise<Image> {
    return this.imageService.getImageForFile(getImageForFileArgs, user);
  }

  @LoggedIn()
  @Query(() => [Image], { name: 'SearchImages' })
  async searchImages(
    @Args() searchImageArgs: SearchImagesArgs,
    @CurrentUser() user: User,
  ): Promise<ImageSearchOutput> {
    return this.imageService.searchImages(
      searchImageArgs,
      this.searchKey,
      user,
    );
  }

  @LoggedIn()
  @Query(() => [Image], { name: 'SearchMyImages' })
  async searchMyImages(
    @Args() searchImageArgs: SearchImagesArgs,
    @CurrentUser() user: User,
  ): Promise<ImageSearchOutput> {
    return this.imageService.searchMyImages(
      searchImageArgs,
      this.searchKey,
      user,
    );
  }

  /**
   * Creates a new image for an already existing file
   * @param createImageInput - contains uuid of file to wrap
   * @param user - Currently logged-in user
   * @returns Requested image
   */
  @LoggedIn()
  @Mutation(() => Image, { name: 'CreateImage' })
  async createImage(
    @Args('createImageInput') createImageInput: CreateImageInput,
    @CurrentUser() user: User,
  ): Promise<Image> {
    return this.imageService.createImage(createImageInput, user);
  }

  /**
   * Deletes an image (without deleting the corresponding file)
   * @param deleteInput - contains uuid of image
   * @param user - Currently logged-in user
   * @returns Requested image
   */
  @LoggedIn()
  @Mutation(() => Image, { name: 'DeleteImage' })
  async deleteImage(
    @Args('deleteImageInput') deleteInput: DeleteInput,
    @CurrentUser() user: User,
  ): Promise<Image> {
    return this.imageService.deleteImage(deleteInput, user);
  }
}
