import { Field, ObjectType } from '@nestjs/graphql';

import Image from '../../entities/image.entity';
import SearchQueryOutputInterface from '../../../abstracts/search/dto/output/search-interface.output';

@ObjectType()
export default class ImageSearchOutput
  implements SearchQueryOutputInterface<Image>
{
  @Field(() => String, {
    description: 'How many items are found within database',
  })
  count: number;

  @Field(() => [Image], { description: 'Image that fit query' })
  data: Image[];
}
