import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementInput } from './dto/input/create-announcement.input';
import { UpdateAnnouncementInput } from './dto/input/update-announcement.input';
import { GetAnnouncementArgs } from './dto/args/get-announcement.args';
import { GetAnnouncementsArgs } from './dto/args/get-announcements.args';
import { DeleteAnnouncementInput } from './dto/input/delete-announcement.input';
import { Announcement } from './entities/announcement.entity';
import { Public } from '../../auth/authentication.decorator';

@Resolver(() => Announcement)
export class AnnouncementResolver {
  constructor(private readonly announcementsService: AnnouncementService) {}

  @Public()
  @Query(() => [Announcement], { name: 'announcements' })
  async getAnnouncements(
    @Args() getAnnouncementsArgs: GetAnnouncementsArgs,
  ): Promise<Announcement[]> {
    return this.announcementsService.getAnnouncements(getAnnouncementsArgs);
  }

  @Public()
  @Query(() => [Announcement], { name: 'allAnnouncements' })
  async getAllAnnouncements(): Promise<Announcement[]> {
    return this.announcementsService.getAllAnnouncements();
  }

  @Public()
  @Query(() => Announcement, { name: 'announcement' })
  async getAnnouncement(
    @Args() getAnnouncementArgs: GetAnnouncementArgs,
  ): Promise<Announcement> {
    return this.announcementsService.getAnnouncement(getAnnouncementArgs);
  }

  @Public()
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

  @Public()
  @Mutation(() => Announcement)
  async updateAnnouncement(
    @Args('updateAnnouncementInput')
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Promise<Announcement> {
    return this.announcementsService.update(updateAnnouncementInput);
  }

  @Public()
  @Mutation(() => Announcement)
  async removeAnnouncement(
    @Args('deleteAnnouncementInput')
    deleteAnnouncementInput: DeleteAnnouncementInput,
  ): Promise<Announcement> {
    return this.announcementsService.remove(deleteAnnouncementInput);
  }
}