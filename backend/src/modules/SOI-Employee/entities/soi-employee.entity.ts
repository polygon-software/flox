import { Person } from '../../person/entities/person.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsDate, IsPhoneNumber, IsString } from 'class-validator';

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
