import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsInt, IsString } from 'class-validator';
import { Item } from '../../item/entities/item.entity';

@ObjectType()
@Entity({ name: 'company' })
export class Company extends BaseEntity {
  @Field(() => String, { description: 'Company Name' })
  @Column()
  @IsString()
  company_name: string;

  @Field(() => String, { description: 'Contact person Name' })
  @Column()
  @IsString()
  person_name: string;

  @Field(() => Int, { description: 'Language' })
  @Column()
  @IsString()
  language: string;

  @Field(() => [Item], { description: 'Items of the user', nullable: true })
  @OneToMany(() => Item, (item) => item.user)
  items: Item[];
}
