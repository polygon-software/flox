import { ObjectType, Field } from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { IsEmail, IsString } from 'class-validator';
import { moduleConfig } from '../../roles';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String, { description: 'Username' })
  @Column()
  @IsString()
  username: string;

  @Field(() => String, { description: 'E-mail address' })
  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Cognito UUID' })
  @Column()
  @IsString()
  cognitoUuid: string;

  @Field(() => String, { description: 'User role', nullable: true })
  @Column({ nullable: true })
  @IsString()
  role: string;

  /**
   * Before inserting or updating data, ensures the role matches one given in config
   * @returns {void}
   */
  @BeforeInsert()
  @BeforeUpdate()
  validateRole() {
    console.log('Validating role!');
    const allowedRoles = moduleConfig().roles;
    if (!allowedRoles.includes(this.role)) {
      throw new Error(`Invalid role '${this.role}'`);
    }
  }
}
