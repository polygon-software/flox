import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';

@ObjectType()
@Entity({ name: 'item' })
export class Item extends BaseEntity {
  @Field(() => String, { description: 'Name' })
  @Column()
  @IsString()
  name: string;

  @Field(() => User, { description: 'User of the item', nullable: true })
  @ManyToOne(() => User, (user) => user.items)
  user: User;
}
