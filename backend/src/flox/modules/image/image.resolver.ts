import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import DeleteInput from '../abstracts/crud/dto/input/delete.input';
import AbstractSearchAccessControlResolver from '../abstracts/search-access-control/abstract-search-access-control.resolver';
import { LoggedIn, Public } from '../auth/authentication.decorator';
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
import ImageSearchOutput from './dto/output/image-search.output';

@Resolver(() => Image)
export default class ImageResolver extends AbstractSearchAccessControlResolver<
  Image,
  ImageService
> {
  constructor(private readonly imageService: ImageService) {
    super(['uuid']);
  }

  /**
   * @returns image service
   */
  get service(): ImageService {
    return this.imageService;
  }

  /**
   * Retrieves a single image from the database, ensuring the provided user has access to it by either being owner or
   * allowed reader of the image. Alternatively, the image can be public, then the user has also access to it.
   *
   * @param getImageArgs - contains uuid of image to be retrieved
   * @param user - the user that retrieves the image
   * @returns the one image that was received
   */
  @LoggedIn()
  @Query(() => Image, { name: 'Image' })
  async getImage(
    @Args() getImageArgs: GetImageArgs,
    @CurrentUser() user: User,
  ): Promise<Image> {
    return this.imageService.getImage(getImageArgs, user);
  }

  /**
   * Retrieves multiple images explicitely specified by their uuid. It only returns the entities that are public, the
   * user is the owner or the user is part of an access group that has read access to these images.
   *
   * @param getMultipleImagesArgs - contains a list of uuids of the images to retrieve
   * @param user - the user that retrieves the image
   * @returns the list of found entities
   */
  @LoggedIn()
  @Query(() => [Image], { name: 'Images' })
  async getImages(
    @Args() getMultipleImagesArgs: GetMultipleImagesArgs,
    @CurrentUser() user: User,
  ): Promise<Image[]> {
    return this.imageService.getMultipleImages(getMultipleImagesArgs, user);
  }

  /**
   * Retrieves multiple images explicitely specified by their uuid. It only returns the entities that the
   * user is the owner or the user is part of an access group that has read access to these images. This
   * endpoint does not return public images, though, since they do not explicitely belong to the user.
   *
   * @param getMultipleImagesArgs - contains a list of uuids of the images to retrieve
   * @param user - the user that retrieves the image
   * @returns the list of found entities
   */
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
   * Retrieves all images from a database with applying pagination. It only returns the entities that are public, the
   * user is the owner or the user is part of an access group that has read access to these images.
   *
   * @param getAllImagesArgs - contains pagination parameters (skip, take)
   * @param user - the user that retrieves the image
   * @returns page of entities
   */
  @Public()
  @Query(() => [Image], { name: 'AllImages' })
  async getAllImages(
    @Args() getAllImagesArgs: GetAllImagesArgs,
    @CurrentUser() user: User,
  ): Promise<Image[]> {
    return this.imageService.getAllImages(getAllImagesArgs, user);
  }

  /**
   * Retrieves all images from a database with applying pagination. It only returns the entities that the
   * user is the owner or the user is part of an access group that has read access to these images. This
   * endpoint does not return public images, though, since they do not explicitely belong to the user.
   *
   * @param getAllImagesArgs - contains pagination parameters (skip, take)
   * @param user - the user that retrieves the image
   * @returns page of entities
   */
  @LoggedIn()
  @Query(() => [Image], { name: 'AllMyImages' })
  async getAllMyImages(
    @Args() getAllImagesArgs: GetAllImagesArgs,
    @CurrentUser() user: User,
  ): Promise<Image[]> {
    return this.imageService.getAllImagesOfUser(getAllImagesArgs, user);
  }

  /**
   * Queries for an image given the file uuid
   *
   * @param getImageForFileArgs - contains uuid of file
   * @param user - user that needs to have the right to access the image
   * @returns Queried image
   */
  @LoggedIn()
  @Query(() => Image, { name: 'ImageForFile' })
  async getImageForFile(
    @Args() getImageForFileArgs: GetImageForFileArgs,
    @CurrentUser() user: User,
  ): Promise<Image> {
    return this.imageService.getImageForFile(getImageForFileArgs, user);
  }

  /**
   * Queries for all entities that fit query criteria. It only returns the entities that are public, the
   * user is the owner or the user is part of an access group that has read access to these images.
   *
   * @param searchImageArgs - contain table filtering rules
   * @param user - user that retrieves entities
   * @returns images that fit criteria
   */
  @LoggedIn()
  @Query(() => ImageSearchOutput, { name: 'SearchImages' })
  async searchImages(
    @Args() searchImageArgs: SearchImagesArgs,
    @CurrentUser() user: User,
  ): Promise<ImageSearchOutput> {
    return this.imageService.searchImages(
      searchImageArgs,
      this.searchKeys,
      user,
    );
  }

  /**
   * Queries for all entities that fit query criteria. It only returns the entities that the
   * user is the owner or the user is part of an access group that has read access to these images. This
   * endpoint does not return public images, though, since they do not explicitely belong to the user.
   *
   * @param searchImageArgs - contain table filtering rules
   * @param user - user that retrieves entities
   * @returns images that fit criteria
   */
  @LoggedIn()
  @Query(() => ImageSearchOutput, { name: 'SearchMyImages' })
  async searchMyImages(
    @Args() searchImageArgs: SearchImagesArgs,
    @CurrentUser() user: User,
  ): Promise<ImageSearchOutput> {
    return this.imageService.searchMyImages(
      searchImageArgs,
      this.searchKeys,
      user,
    );
  }

  /**
   * Creates a new image for an already existing file
   *
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
   * Removes the database entry of a given image without deleting the file
   * This endpoint does not delete the corresponding file!
   *
   * @param deleteInput - contains the uuid of the image to delete
   * @param user - user that needs to have the right to access the image
   * @returns Deleted Image
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
