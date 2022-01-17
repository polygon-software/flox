import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementInput } from './dto/input/create-announcement.input';
import { UpdateAnnouncementInput } from './dto/input/update-announcement.input';
import { GetAnnouncementArgs } from './dto/args/get-announcement.args';
import { GetAnnouncementsArgs } from './dto/args/get-announcements.args';
import { DeleteAnnouncementInput } from './dto/input/delete-announcement.input';
import { Announcement } from './entities/announcement.entity';
import { AdminOnly } from '../../auth/authorization.decorator';

@Resolver(() => Announcement)
export class AnnouncementResolver {
  constructor(private readonly announcementsService: AnnouncementService) {}

  @AdminOnly()
  @Query(() => [Announcement], { name: 'announcements' })
  async getAnnouncements(
    @Args() getAnnouncementsArgs: GetAnnouncementsArgs,
  ): Promise<Announcement[]> {
    return this.announcementsService.getAnnouncements(getAnnouncementsArgs);
  }

  @AdminOnly()
  @Query(() => [Announcement], { name: 'allAnnouncements' })
  async getAllAnnouncements(): Promise<Announcement[]> {
    return this.announcementsService.getAllAnnouncements();
  }

  @AdminOnly()
  @Query(() => Announcement, { name: 'announcement' })
  async getAnnouncement(
    @Args() getAnnouncementArgs: GetAnnouncementArgs,
  ): Promise<Announcement> {
    return this.announcementsService.getAnnouncement(getAnnouncementArgs);
  }

  @AdminOnly()
  @Mutation(() => Announcement)
  async createAnnouncement(
    @Args({
      name: 'createAnnouncementInput',
      type: () => CreateAnnouncementInput,
    })
    createAnnouncementInput: CreateAnnouncementInput,
  ): Promise<Announcement> {
    return this.announcementsService.create(createAnnouncementInput);
  }

  @AdminOnly()
  @Mutation(() => Announcement)
  async updateAnnouncement(
    @Args('updateAnnouncementInput')
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Promise<Announcement> {
    return this.announcementsService.update(updateAnnouncementInput);
  }

  @AdminOnly()
  @Mutation(() => Announcement)
  async deleteAnnouncement(
    @Args('deleteAnnouncementInput')
    deleteAnnouncementInput: DeleteAnnouncementInput,
  ): Promise<Announcement> {
    return this.announcementsService.delete(deleteAnnouncementInput);
  }
}
