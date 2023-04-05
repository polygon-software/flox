import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export default class FolderOutput {
  @Field(() => ID, {
    description: 'Name of the folder',
  })
  uuid: string;

  @Field(() => String, {
    description: 'Name of the folder',
  })
  name: string;

  @Field(() => Number, {
    description: 'Number of files',
  })
  @IsNumber()
  public files: number;

  @Field(() => Number, {
    description: 'Summed of size of all files in folder, in bytes',
  })
  @IsNumber()
  public size: number;

  @Field(() => Date, { description: 'Creation date of oldest file in folder' })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date, {
    description: 'Last modification of any file in folder',
    nullable: true,
  })
  @UpdateDateColumn()
  updatedAt?: Date;
}
