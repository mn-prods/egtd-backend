import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/resources/auth/auth.module';
import { Language } from './entities/language.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { provideCustomRepository } from 'src/shared/provider/provide-custom-repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Language]), AuthModule, HttpModule],
  providers: [UserService, provideCustomRepository(User, UserRepository)],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
