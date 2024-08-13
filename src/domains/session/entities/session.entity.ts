import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { SessionStatus } from 'domains/session/constants/session-status.enum';
import { ImageEncodingEntity } from 'domains/session/entities/image-encoding.entity';

@Entity()
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  status: SessionStatus;

  @OneToMany(
    () => ImageEncodingEntity,
    (imageEncodingEntity) => imageEncodingEntity.session,
  )
  @JoinTable()
  imageEncodings?: ImageEncodingEntity[];
}
