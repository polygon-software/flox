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

  /**
   * Create a new Announcement, this automatically creates the notifications for the given user-role.
   * @param {CreateAnnouncementInput} createAnnouncementInput - input
   * @returns {Promise<Announcement>} - The created announcement
   */
  async create(
    createAnnouncementInput: CreateAnnouncementInput,
  ): Promise<Announcement> {
    // Create the announcement
    const announcement = this.announcementsRepository.create(
      createAnnouncementInput,
    );
    announcement.notifications = await this.userService.broadcastAnnouncement(
      announcement,
    );
    return this.announcementsRepository.save(announcement);
  }

  /**
   * Get announcements specified by their uuids or all if no uuids are provided.
   * @param {GetAnnouncementsArgs} getAnnouncementsArgs - uuids
   * @returns {Promise<Announcement[]>} - requested announcements
   */
  async getAnnouncements(
    getAnnouncementsArgs: GetAnnouncementsArgs,
  ): Promise<Announcement[]> {
    if (getAnnouncementsArgs.uuids !== undefined) {
      return this.announcementsRepository.findByIds(getAnnouncementsArgs.uuids);
    } else {
      return this.announcementsRepository.find();
    }
  }

  /**
   * Get all announcements.
   * @returns {Promise<Announcement[]>} - all announcements
   */
  async getAllAnnouncements(): Promise<Announcement[]> {
    return this.announcementsRepository.find();
  }

  /**
   * Get announcement specified by its uuid.
   * @param {GetAnnouncementArgs} getAnnouncementArgs - uuid
   * @returns {Promise<Announcement[]>} - requested announcement
   */
  async getAnnouncement(
    getAnnouncementArgs: GetAnnouncementArgs,
  ): Promise<Announcement> {
    return this.announcementsRepository.findOne(getAnnouncementArgs.uuid);
  }

  /**
   * Partially updates an existing announcement. Updates all notifications belonging to the updated announcement.
   * @param {UpdateAnnouncementInput} updateAnnouncementInput - Changes to be made to the announcement
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
    );
    updatedAnnouncement.notifications.forEach((notification) => {
      notification.title = announcement.title;
      notification.content = announcement.content;
      notification.received = announcement.date;
      notification.isRead = false;
    });
    return this.announcementsRepository.save(updatedAnnouncement);
  }

  /**
   * Deletes an existing announcement. Deletes all notifications belonging to the deleted announcement.
   * @param {DeleteAnnouncementInput} deleteAnnouncementInput - uuid
   * @returns {Promise<Announcement>} - deleted announcement
   */
  async delete(
    deleteAnnouncementInput: DeleteAnnouncementInput,
  ): Promise<Announcement> {
    const announcement = await this.announcementsRepository.findOne(
      deleteAnnouncementInput.uuid,
    );
    await Promise.all(
      announcement.notifications.map((notification) =>
        this.notificationService.delete(notification),
      ),
    );
    const uuid = announcement.uuid;
    const deletedAnnouncement = await this.announcementsRepository.remove(
      announcement,
    );
    deletedAnnouncement.uuid = uuid;
    return deletedAnnouncement;
  }
}
