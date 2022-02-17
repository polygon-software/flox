import { Resolver, Query, Args } from '@nestjs/graphql';
import { PreviewService } from './preview.service';
import { Public } from '../../auth/authentication.decorator';
import { GetPreviewArgs } from './dto/get-preview.args';

@Resolver()
export class PreviewResolver {
  constructor(private readonly previewService: PreviewService) {}

  @Public()
  @Query(() => String, { name: 'preview' })
  async getPreview(@Args() getPreviewArgs: GetPreviewArgs) {
    return this.previewService.getFileLocation(getPreviewArgs);
  }
}
