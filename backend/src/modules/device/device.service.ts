import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
}
