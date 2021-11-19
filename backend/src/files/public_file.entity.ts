import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base-entity/entities/base-entity.entity';

@Entity()
export class PublicFile extends BaseEntity {
  @Column()
  public url: string;

  @Column()
  public key: string;
}

export default PublicFile;
