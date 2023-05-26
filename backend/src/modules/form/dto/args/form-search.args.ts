import { ArgsType, Field } from '@nestjs/graphql';
import { IsObject, IsOptional } from 'class-validator';

import SearchArgs from '../../../../flox/modules/abstracts/search/dto/args/search.args';
import FormFilterInput from '../input/form-filter.input';

@ArgsType()
export default class FormSearchArgs extends SearchArgs {
  @Field(() => FormFilterInput, {
    description: 'Filter by property and search term',
    nullable: true,
  })
  @IsObject()
  @IsOptional()
  filter?: FormFilterInput;
}
