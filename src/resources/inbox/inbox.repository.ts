import { Repository } from 'typeorm';
import { InboxItem } from './entities/inbox-item.entity';

export class InboxRepository extends Repository<InboxItem> {}
