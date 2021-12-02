import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsDate, IsInt, IsString } from 'class-validator';
import PublicFile from '../../file/entities/public_file.entity';

@ObjectType()
@Entity({ name: 'product' })
@InputType('product')
export class Product extends BaseEntity {
  @Field(() => String, { description: 'Title' })
  @Column()
  @IsString()
  title: string;

  @Field(() => String, { description: 'Description' })
  @Column()
  @IsString()
  description: string;

  @Field(() => Int, { description: 'Value' })
  @Column()
  @IsInt()
  value: number;

  @Field(() => Date, { description: 'Start date' })
  @Column()
  @IsDate()
  start: Date;

  @Field(() => Date, { description: 'End Date' })
  @Column()
  @IsDate()
  end: Date;

  @Field(() => [PublicFile], {
    description: 'Pictures for the product',
    nullable: true,
  })
  @OneToMany(() => PublicFile, (picture) => picture.product)
  pictures: PublicFile[];

  // TODO: Remaining fields from UML
}
