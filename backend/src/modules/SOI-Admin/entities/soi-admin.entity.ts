import { ObjectType } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';
import { Entity } from 'typeorm';

@ObjectType()
/**
 * An Admin with SOI
 */
@Entity({ name: 'soiadmin' })
export class SoiAdmin extends Person {}
