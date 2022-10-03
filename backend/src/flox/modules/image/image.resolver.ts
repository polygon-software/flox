import { Args, Resolver, Query } from '@nestjs/graphql';
import { ImageService } from './image.service';
import { Public } from '../auth/authentication.decorator';
import Image from './entities/image.entity';
import { GetImageArgs } from './dto/args/get-image.args';

@Resolver(() => Image)
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Public()
  @Query(() => Image, { name: 'getImage' })
  async getImage(@Args() getImageArgs: GetImageArgs): Promise<Image> {
    return this.imageService.getImage(getImageArgs);
  }
}
