import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongodbModule } from 'src/mongodb/mongodb.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule, MongodbModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
