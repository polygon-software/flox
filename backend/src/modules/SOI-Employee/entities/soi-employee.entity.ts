import { Person } from '../../person/entities/person.entity';
import { Entity } from 'typeorm';
import { ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class SoiEmployee extends Person {}
