import { Module } from '@nestjs/common';
import { provideCustomRepository } from 'src/shared/provider/provide-custom-repository';
import { InboxItem } from './entities/inbox-item.entity';
import { InboxController } from './inbox.controller';
import { InboxRepository } from './inbox.repository';
import { InboxService } from './inbox.service';
import { MongodbModule } from 'src/mongodb/mongodb.module';

@Module({
  imports: [MongodbModule],
  controllers: [InboxController],
  providers: [InboxService, provideCustomRepository(InboxItem, InboxRepository)]
})
export class InboxModule {}
