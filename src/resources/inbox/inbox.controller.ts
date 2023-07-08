import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { JWTUserData } from '../user/dto/jwt-user-data.dto';
import { ChangeInboxItemStatusDto } from './dto/change-item-status.dto';
import { CreateInboxDto } from './dto/create-inbox.dto';
import { InboxItem } from './entities/inbox-item.entity';
import { InboxService } from './inbox.service';

@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Post()
  async create(
    @Body() createInboxDto: CreateInboxDto,
    @GetUser() { userId }: JWTUserData
  ): Promise<InboxItem> {
    return this.inboxService.create(userId, createInboxDto);
  }

  @Get()
  async findAll(@GetUser() { userId }: JWTUserData): Promise<InboxItem[]> {
    return this.inboxService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inboxService.findOne(+id);
  }

  @Patch(':id/status')
  update(@Param('id') id: string, @Body() updateInboxDto: ChangeInboxItemStatusDto) {
    return this.inboxService.changeItemStatus(id, updateInboxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inboxService.remove(+id);
  }
}
