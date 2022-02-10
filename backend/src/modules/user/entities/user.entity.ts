import { createUnionType, Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString, IsUUID } from 'class-validator';
import { ROLE } from '../../../ENUM/ENUMS';
import { Bank } from '../../bank/entities/bank.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { SoiEmployee } from '../../SOI-Employee/entities/soi-employee.entity';
import { Company } from '../../company/entities/company.entity';

export const PersonType = createUnionType({
  name: 'PersonType',
  types: () => [Bank, Employee, SoiEmployee, Company],
});

@Entity()
@ObjectType()
export class User {
  @Field(() => ROLE, { description: 'Role of the User' })
  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.NONE,
  })
  @IsString()
  role: ROLE;

  @Field(() => ID, { description: 'Cognito ID' })
  @PrimaryColumn()
  @IsUUID()
  uuid: string;

  @Field(() => ID, { description: 'UUID of the specific entity' })
  @Column()
  @IsUUID()
  fk: string;

  @Field(() => Date, { description: 'Creation date' })
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date, { description: 'Last modification date' })
  @UpdateDateColumn()
  last_modified_at: Date;

  @Field(() => Date, { description: 'Date of deletion', nullable: true })
  @DeleteDateColumn()
  deleted_at: Date;
}
