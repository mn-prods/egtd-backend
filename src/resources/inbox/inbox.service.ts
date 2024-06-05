import { Injectable } from '@nestjs/common';
import { CreateInboxDto } from './dto/create-inbox.dto';
import { UpdateInboxDto } from './dto/update-inbox.dto';
import { InboxItem, InboxItemStatus } from './entities/inbox-item.entity';
import { InboxRepository } from './inbox.repository';
import { User } from '../user/entities/user.entity';
import { UpdateResult } from 'typeorm';

@Injectable()
export class InboxService {
  constructor(private inboxRepository: InboxRepository) {}

  async create(userUid: string, createInboxDto: CreateInboxDto): Promise<InboxItem> {
    const newInboxItemData = {
      ...createInboxDto,
      owner: { uid: userUid } as User
    };

    const newInboxItem = this.inboxRepository.create(newInboxItemData);

    return this.inboxRepository.save(newInboxItem);
  }

  async findAll(userUid: string): Promise<InboxItem[]> {
    return this.inboxRepository.find({ where: { owner: { uid: userUid } } });
  }

  findOne(id: number) {
    return `This action returns a #${id} inbox`;
  }

  async changeItemStatus(id: string, status: InboxItemStatus): Promise<UpdateResult> {
    return this.inboxRepository
      .createQueryBuilder()
      .update()
      .set({ status })
      .where({ id })
      .execute();
  }

  async changeItemLabel(id: string, label: string) {
    return this.inboxRepository
      .createQueryBuilder()
      .update()
      .set({ label })
      .where({ id })
      .execute();
  }

  remove(id: string) {
    return this.inboxRepository.delete({ id });
  }
}
