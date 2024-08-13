import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ImageEncodingStatus } from 'domains/session/constants/image-encoding-status.enum';
import { SessionEntity } from 'domains/session/entities/session.entity';

@Entity()
export class ImageEncodingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  imageUrl: string;

  @Column({ type: 'uuid' })
  sessionId: string;

  @Column({ type: 'text' })
  imageName: string;

  @Column({ type: 'text' })
  status: ImageEncodingStatus;

  @Column({ type: 'jsonb', nullable: true })
  error: string;

  @Column({ type: 'jsonb', nullable: true })
  encodings: number[][];

  @ManyToOne(
    () => SessionEntity,
    (sessionEntity) => sessionEntity.imageEncodings,
  )
  session?: SessionEntity;
}
