import { IsEnum } from 'class-validator';
import { InboxItemStatus } from '../entities/inbox-item.entity';

export class ChangeInboxItemStatusDto {
  @IsEnum(InboxItemStatus)
  status: InboxItemStatus;
}
