import { PartialType } from '@nestjs/swagger';
import { CreateInboxDto } from './create-inbox.dto';
import { InboxItemStatus } from '../entities/inbox-item.entity';

export class UpdateInboxDto extends PartialType(CreateInboxDto) {
    label?: string;
    status: InboxItemStatus;
}
