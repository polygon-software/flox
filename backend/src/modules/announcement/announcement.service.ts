import { Injectable } from '@nestjs/common';
import { CreateAnnouncementInput } from './dto/input/create-announcement.input';
import { UpdateAnnouncementInput } from './dto/input/update-announcement.input';
import { GetAnnouncementArgs } from './dto/args/get-announcement.args';
import { GetAnnouncementsArgs } from './dto/args/get-announcements.args';
import { DeleteAnnouncementInput } from './dto/input/delete-announcement.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    createAnnouncementInput: CreateAnnouncementInput,
  ): Promise<Announcement> {
    // Create the announcement
    const announcement = this.announcementsRepository.create({
      ...createAnnouncementInput,
      date: new Date(),
    });
    announcement.notifications = await this.userService.broadcastAnnouncement(
      announcement,
    );
    return await this.announcementsRepository.save(announcement);
  }

  getAnnouncements(
    getAnnouncementsArgs: GetAnnouncementsArgs,
  ): Promise<Announcement[]> {
    if (getAnnouncementsArgs.uuids !== undefined) {
      return this.announcementsRepository.findByIds(
        getAnnouncementsArgs.uuids,
        {
          relations: ['notifications'],
        },
      );
    } else {
      return this.announcementsRepository.find({
        relations: ['notifications'],
      });
    }
  }

  getAllAnnouncements(): Promise<Announcement[]> {
    return this.announcementsRepository.find({
      relations: ['notifications'],
    });
  }

  getAnnouncement(
    getAnnouncementArgs: GetAnnouncementArgs,
  ): Promise<Announcement> {
    return this.announcementsRepository.findOne(getAnnouncementArgs.uuid, {
      relations: ['notifications'],
    });
  }

  /**
   * Updates an existing announcement
   * @param {UpdateAnnouncementInput} updateAnnouncementInput - update announcement input
   * @returns {Promise<Announcement>} - updated announcement
   */
  async update(
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Promise<Announcement> {
    // Update the announcement
    const announcement = this.announcementsRepository.create({
      ...updateAnnouncementInput,
      date: new Date(),
    });
    await this.announcementsRepository.update(
      updateAnnouncementInput.uuid,
      announcement,
    );
    const updatedAnnouncement = await this.announcementsRepository.findOne(
      updateAnnouncementInput.uuid,
      { relations: ['notifications'] },
    );
    updatedAnnouncement.notifications.forEach((notification) => {
      notification.title = announcement.title;
      notification.content = announcement.content;
      notification.received = announcement.date;
      notification.isRead = false;
    });
    return await this.announcementsRepository.save(updatedAnnouncement);
  }

  async delete(
    deleteAnnouncementInput: DeleteAnnouncementInput,
  ): Promise<Announcement> {
    const announcement = await this.announcementsRepository.findOne(
      deleteAnnouncementInput.uuid,
      { relations: ['notifications'] },
    );
    await Promise.all(
      announcement.notifications.map((notification) =>
        this.notificationService.delete(notification),
      ),
    );
    const uuid = announcement.uuid;
    const deleted_announcement = await this.announcementsRepository.remove(
      announcement,
    );
    deleted_announcement.uuid = uuid;
    return deleted_announcement;
  }
}
