import { Body, Controller, Get, Logger, Post, Query, Sse, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { JWTUserData } from '../user/dto/jwt-user-data.dto';
import { InboxService } from './inbox.service';
import { ReplicationPullParams } from 'src/shared/replication-pull-params.dto';
import { ReplicationPushData } from 'src/mongodb/replication-push.interface';
import { FirebaseJwtAuthGuard } from '../auth/firebase-jwt.guard';

@Controller('inbox')
@UseGuards(FirebaseJwtAuthGuard)
export class InboxController {
  logger = new Logger(InboxController.name);

  constructor(private readonly inboxService: InboxService) {}

  @Get('replication/pull')
  async pull(@Query() pullParams: ReplicationPullParams, @GetUser() { userId }: JWTUserData) {
    this.logger.log(`Start replication pull for ${userId}`);
    return this.inboxService.replicatePull(pullParams);
  }

  @Post('replication/push')
  async push(@Body() changeRows: ReplicationPushData[], @GetUser() { userId }: JWTUserData) {
    this.logger.log(`Start replication push for ${userId}`);
    return this.inboxService.replicatePush(changeRows);
  }

  @Sse('replication/pull/stream')
  pullStream(@GetUser() { userId }: JWTUserData) {
    this.logger.log(`Start replication pull-stream for ${userId}`);
    return this.inboxService.pullStream$.asObservable();
  }
}
