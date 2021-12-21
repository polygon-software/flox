import { Field, ObjectType } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';
import { Column, Entity } from 'typeorm';
import { IsPhoneNumber, IsString } from 'class-validator';

@ObjectType()
@Entity()
export class SoiEmployee extends Person {
  @Column()
  @Field(() => String, { description: 'Phone Number' })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Column()
  @Field(() => String, { description: 'Gender' })
  @IsString()
  gender: string;
}
