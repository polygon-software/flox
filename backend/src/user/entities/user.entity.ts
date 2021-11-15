import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsInt, IsString } from 'class-validator';
import { Item } from '../../item/entities/item.entity';

@ObjectType()
@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Field(() => String, { description: 'Name' })
  @Column()
  @IsString()
  name: string;

  @Field(() => Int, { description: 'Age' })
  @Column()
  @IsInt()
  age: number;

  @Field(() => [Item], { description: 'Items of the user', nullable: true })
  @OneToMany(() => Item, (item) => item.user)
  items: Item[];
}
