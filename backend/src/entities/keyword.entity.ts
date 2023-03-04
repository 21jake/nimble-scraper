import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Batch } from './batch.entity';

@Entity('keywords')
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fileName: string;

  @Column({ type: 'boolean', nullable: true })
  success: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  proxy: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  error: string;

  @Column({ type: 'bigint', nullable: true })
  totalLinks: number;

  @Column({ type: 'bigint', nullable: true })
  totalAds: number;

  @Column({ type: 'bigint', nullable: true })
  totalResults: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  searchTime: string;

  @ManyToOne(() => Batch, (batch) => batch.keywords, { onDelete: 'CASCADE', nullable: false })
  batch: Batch;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdDate: Date;
}
