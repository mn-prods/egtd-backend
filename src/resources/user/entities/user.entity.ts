import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from 'typeorm';
import { Language } from './language.entity';
import { InboxItem } from 'src/resources/inbox/entities/inbox-item.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  uid: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  email?: string;

  @Column({ type: 'varchar', name: 'username', nullable: true })
  userName?: string;

  @Column({ type: 'varchar', length: 8000 })
  avatar: string;

  @Column({ type: 'varchar', length: 1, nullable: true })
  gender?: string;

  @Column({ type: 'float', nullable: true })
  weight?: number;

  @Column({ type: 'float', nullable: true })
  height?: number;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ type: 'int', name: 'activity_level', nullable: true })
  activityLevel?: number;

  @ManyToOne(() => Language, (language) => language.users)
  @JoinColumn({ name: 'language_id' })
  language?: Language;

  @OneToMany(() => InboxItem, (inboxItem) => inboxItem.owner)
  inboxItems: InboxItem[];
}
