import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { LoggedIn } from '../../flox/modules/auth/authentication.decorator';
import CreateFileInput from '../../flox/modules/file/dto/input/create-file.input';
import AbstractSearchResolver from '../../flox/modules/abstracts/search/abstract-search.resolver';

import ImageFileService from './image-file.service';
import ImageFile from './entities/image-file.entity';

@Resolver(() => ImageFile)
export default class ImageFileResolver extends AbstractSearchResolver<
  ImageFile,
  ImageFileService
> {
  constructor(private readonly imageFileService: ImageFileService) {
    super(['filename', 'path']);
  }

  /**
   * @returns file service
   */
  get service(): ImageFileService {
    return this.imageFileService;
  }

  /**
   * Creates a new file based on the create input and sets the user as the items owner.
   *
   * @param createFileInput - specifications of file, must be deep partial of entity
   * @returns the created file
   */
  @LoggedIn()
  @Mutation(() => ImageFile, { name: 'CreateImageFile' })
  async createImageFile(
    @Args('createFileInput') createFileInput: CreateFileInput,
  ): Promise<ImageFile> {
    const file = await super.create(createFileInput);
    const signedUrl = await this.imageFileService.createSignedUploadUrl(file);
    const updatedFile = await this.imageFileService.updateNestedEntity({
      uuid: file.uuid,
    });
    return {
      ...updatedFile,
      signedUrl,
    } as ImageFile;
  }
}
