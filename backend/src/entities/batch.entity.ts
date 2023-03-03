import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne } from 'typeorm';
import { Keyword } from './keyword.entity';
import { User } from './user.entity';

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  originalName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  fileName: string;

  @ManyToOne(() => User, (user) => user.batches, { onDelete: 'CASCADE', nullable: false  })
  uploader: User;

  @OneToMany(() => Keyword, (keyword) => keyword.batch)
  keywords: Keyword[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdDate: Date;
}
