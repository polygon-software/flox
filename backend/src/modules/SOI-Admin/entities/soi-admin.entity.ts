import { Person } from '../../person/entities/person.entity';
import { Entity } from 'typeorm';
import { ObjectType } from '@nestjs/graphql';

/**
 * An Admin with SOI
 */
@Entity()
@ObjectType()
export class SoiAdmin extends Person {}
