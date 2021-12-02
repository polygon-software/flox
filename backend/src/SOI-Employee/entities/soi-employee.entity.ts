import { ObjectType } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';

@ObjectType()
export class SoiEmployeeEntity extends Person {}
