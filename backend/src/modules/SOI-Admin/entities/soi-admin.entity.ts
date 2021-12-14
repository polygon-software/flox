import { ObjectType } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';

@ObjectType()
/**
 * An Admin with SOI
 */
export class SoiAdmin extends Person {}
