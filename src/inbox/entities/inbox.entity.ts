import { User } from 'src/resources/user/entities/user.entity';
import { BaseEntity } from 'src/shared/entity/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum InboxItemStatus {
  open = 'OPEN',
  closed = 'CLOSED',
  deleted = 'DELETED'
}

@Entity({ name: 'inbox' })
export class InboxItem extends BaseEntity {
  @Column({ nullable: false, default: InboxItemStatus.open })
  status: InboxItemStatus;

  @ManyToOne(() => User, (user) => user.inboxItems)
  @JoinColumn({ name: 'owner_uid' })
  owner: User;
}
