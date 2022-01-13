import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementResolver } from './announcement.resolver';
import { AnnouncementService } from './announcement.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement]), UserModule],
  providers: [AnnouncementResolver, AnnouncementService],
})
export class AnnouncementModule {}
