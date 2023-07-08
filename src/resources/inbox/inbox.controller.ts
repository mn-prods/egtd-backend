import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InboxService } from './inbox.service';
import { CreateInboxDto } from './dto/create-inbox.dto';
import { UpdateInboxDto } from './dto/update-inbox.dto';
import { InboxItem } from './entities/inbox-item.entity';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { JWTUserData } from '../user/dto/jwt-user-data.dto';

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
  async findAll(@GetUser() {userId}: JWTUserData): Promise<InboxItem[]> {
    return this.inboxService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inboxService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInboxDto: UpdateInboxDto) {
    return this.inboxService.update(+id, updateInboxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inboxService.remove(+id);
  }
}
