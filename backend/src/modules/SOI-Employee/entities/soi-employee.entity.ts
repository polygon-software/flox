import { ObjectType } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';
import { Entity } from 'typeorm';

@ObjectType()
@Entity('soiemployee')
export class SoiEmployee extends Person {}
