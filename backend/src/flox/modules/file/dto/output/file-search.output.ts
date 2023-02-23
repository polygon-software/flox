import { Field, ObjectType } from '@nestjs/graphql';

import S3File from '../../entities/file.entity';
import SearchQueryOutputInterface from '../../../abstracts/search/dto/output/search-interface.output';

@ObjectType()
export default class FileSearchOutput
  implements SearchQueryOutputInterface<S3File>
{
  @Field(() => String, {
    description: 'How many items are found within database',
  })
  count: number;

  @Field(() => [S3File], { description: 'Files that fit query' })
  data: S3File[];
}
