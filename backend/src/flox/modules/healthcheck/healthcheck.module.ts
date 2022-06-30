import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';
import { FileResolver } from '../file/file.resolver';
import { FileController } from '../file/file.controller';

@Module({
  providers: [HealthcheckService],
  controllers: [HealthcheckController],
})
export class HealthcheckModule {}
