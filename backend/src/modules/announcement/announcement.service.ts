import { Injectable } from '@nestjs/common';
import { CreateAnnouncementInput } from './dto/input/create-announcement.input';
import { UpdateAnnouncementInput } from './dto/input/update-announcement.input';
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
    if (!announcement.scheduled) {
      announcement.date = new Date(new Date().setHours(0, 0, 0, 0));
    }
    announcement.notifications = await this.userService.broadcastAnnouncement(
      announcement,
    );
    return this.announcementsRepository.save(announcement);
  }

  /**
   * Get all announcements.
   * @returns {Promise<Announcement[]>} - all announcements
   */
  async getAllAnnouncements(): Promise<Announcement[]> {
    return this.announcementsRepository.find();
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
    const announcement = this.announcementsRepository.create(
      updateAnnouncementInput,
    );
    if (!announcement.scheduled) {
      announcement.date = new Date(new Date().setHours(0, 0, 0, 0));
    }
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
