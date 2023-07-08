import { Injectable } from '@nestjs/common';
import { CreateInboxDto } from './dto/create-inbox.dto';
import { UpdateInboxDto } from './dto/update-inbox.dto';
import { InboxItem } from './entities/inbox-item.entity';
import { InboxRepository } from './inbox.repository';
import { User } from '../user/entities/user.entity';

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

  update(id: number, updateInboxDto: UpdateInboxDto) {
    return `This action updates a #${id} inbox`;
  }

  remove(id: number) {
    return `This action removes a #${id} inbox`;
  }
}
