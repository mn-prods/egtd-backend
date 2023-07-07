import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/resources/auth/auth.service';
import { UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private http: HttpService
  ) {}

  async getByUid(uid: string): Promise<User> {
    return this.userRepository.findOne({ where: { uid } });
  }

  @Transactional()
  async createUserIfNotExists(uid: string) {
    const userRecord = await this.authService.authUserByUid(uid);

    const user = await this.getByUid(uid);

    if (!user) {
      return this.createUser(userRecord);
    }

    return user;
  }

  @Transactional()
  async updateUser(uid: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.userRepository.update({ uid }, updateUserDto);
  }

  async createUser(userRecord: UserRecord) {
    const { data: image } = await firstValueFrom(
      this.http.get<ArrayBuffer>(userRecord.photoURL, {
        responseType: 'arraybuffer'
      })
    );

    const user = this.userRepository.create({
      uid: userRecord.uid,
      email: userRecord.email,
      userName: userRecord.displayName,
      avatar: Buffer.from(image).toString('base64')
    });

    return this.userRepository.save(user);
  }


}
