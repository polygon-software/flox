import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';
import { IsDate, IsPhoneNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Dossier } from '../../dossier/entity/dossier.entity';

@Entity()
@ObjectType()
export class Employee extends Person {
  @Column()
  @Field(() => String, { description: 'Language' })
  @IsString()
  language: string;

  @Column()
  @Field(() => String, { description: 'Function within the company' })
  @IsString()
  function: string;

  @Column()
  @Field(() => String, { description: 'Phone Number' })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Column()
  @Field(() => String, { description: 'Gender' })
  @IsString()
  gender: string;

  @Field(() => Company, { description: 'Company' })
  @JoinColumn()
  @ManyToOne(() => Company, { eager: true })
  company: Company;

  @Field(() => [Dossier], { description: 'Dossiers of employee' })
  @OneToMany(() => Dossier, (dossier) => dossier.employee)
  dossiers: Dossier[];

  @Field(() => ID, {
    description: 'Date of account ban (if any)',
    nullable: true,
  })
  @Column()
  @IsDate()
  banned_at: Date;
}
