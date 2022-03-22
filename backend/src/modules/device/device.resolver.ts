import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { DeviceService } from './device.service';
import {
  AdminOnly,
  AnyRole,
  CurrentUser,
} from '../../auth/authorization.decorator';
import { Device } from '../../types/Device';
import { GetUserDevicesArgs } from './dto/args/get-user-devices.args';
import { GetMyDevicesArgs } from './dto/args/get-my-devices.args';
import { GetUserArgs } from '../user/dto/args/get-user.args';
import { GetLevelWritingArgs } from './dto/args/get-level-writing.args';
import { LevelWriting } from '../../types/LevelWriting';
import { UnauthorizedException } from '@nestjs/common';
import { GetEventTableArgs } from './dto/args/get-event-table.args';
import { EventsTable } from '../../types/EventsTable';
import { DeviceParams } from '../../types/DeviceParams';
import { GetDeviceParamsArgs } from './dto/args/get-device-params.args';
import { GetConnectionLogsArgs } from './dto/args/get-connection-logs.args';
import { ConnectionLogEntry } from '../../types/ConnectionLogEntry';
import { GetConnectionLogCountArgs } from './dto/args/get-connection-log-count.args';
import { GetDeviceLogArgs } from './dto/args/get-device-log.args';
import { DeviceLog } from '../../types/DeviceLog';
import { AddContactToDeviceInput } from './dto/input/add-contact-to-device.input';
import { GetDeviceContactsArgs } from './dto/args/get-device-contacts.args';
import { DeviceContact } from '../../types/DeviceContact';
import { EditContactInput } from './dto/input/edit-contact.input';
import { DeleteContactInput } from './dto/input/delete-contact.input';
import { FTPLog } from '../../types/FTPLog';

@Resolver(() => Device)
export class DeviceResolver {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly userService: UserService,
  ) {}

  /**
   * Get the level writings for multiple devices if the user has permission.
   * @param {GetLevelWritingArgs} getLevelWritingArgs - StationIds, start, end & resolution
   * @param {Record<string, string>} user - Cognito user from request.
   * @returns {Promise<LevelWriting>} - The level writings of the devices.
   */
  @AnyRole()
  @Query(() => LevelWriting, { name: 'levelWriting' })
  async getLevelWriting(
    @Args() getLevelWritingArgs: GetLevelWritingArgs,
    @CurrentUser() user: Record<string, string>,
  ): Promise<LevelWriting> {
    const dbUser = await this.userService.getMyUser(user);
    getLevelWritingArgs.clients.forEach((stationId) => {
      if (!this.userService.isAuthorizedForDevice(dbUser, stationId)) {
        throw new UnauthorizedException();
      }
    });

    return this.deviceService.getLevelWriting(getLevelWritingArgs);
  }

  /**
   * Get the device parameters if the user has permission.
   * @param {GetDeviceParamsArgs} getDeviceParamsArgs - StationId
   * @param {Record<string, string>} user - Cognito user from request.
   * @returns {Promise<DeviceParams>} - The parameters of the device.
   */
  @AnyRole()
  @Query(() => DeviceParams, { name: 'deviceParams' })
  async getDeviceParams(
    @Args() getDeviceParamsArgs: GetDeviceParamsArgs,
    @CurrentUser() user: Record<string, string>,
  ): Promise<DeviceParams> {
    const dbUser = await this.userService.getMyUser(user);
    if (
      !this.userService.isAuthorizedForDevice(dbUser, getDeviceParamsArgs.cli)
    ) {
      throw new UnauthorizedException();
    }
    return this.deviceService.getDeviceParams(getDeviceParamsArgs);
  }

  /**
   * Returns a list of a given user's MR2000 & MR3000 devices
   * @param {GetUserDevicesArgs} getUserDevicesArgs - contains user's UUID
   * @returns {Promise<Device[]>} - the user's devices
   */
  @AdminOnly()
  @Query(() => [Device], { name: 'getUserDevices' })
  async getUserDevices(@Args() getUserDevicesArgs: GetUserDevicesArgs) {
    return this.deviceService.getUserDevices(getUserDevicesArgs);
  }

  /**
   * Returns a list of the current user's devices
   * @param {Record<string, string>}  user - currently logged-in user from request
   * @param {GetMyDevicesArgs} [getMyDevicesArgs] - arguments containing whether to return only unassigned devices
   * @returns {Promise<Project[]>} - the user's projects
   */
  @AnyRole()
  @Query(() => [Device], { name: 'myDevices' })
  async myDevices(
    @CurrentUser() user: Record<string, string>,
    @Args() getMyDevicesArgs?: GetMyDevicesArgs,
  ) {
    // Get user
    const dbUser = await this.userService.getUser({
      cognitoUuid: user.userId,
    } as GetUserArgs);

    if (!dbUser) {
      throw new Error(`No user found for ${user.userId}`);
    }
    return this.deviceService.getUserDevices({
      uuid: dbUser.uuid,
      unassigned: getMyDevicesArgs?.unassigned ?? false,
      assigned: getMyDevicesArgs?.assigned ?? false,
    } as GetUserDevicesArgs);
  }

  @AnyRole()
  @Query(() => EventsTable, { name: 'eventTable' })
  async getEventTable(
    @Args() eventTableArgs: GetEventTableArgs,
    @CurrentUser() user: Record<string, string>,
  ): Promise<EventsTable> {
    const dbUser = await this.userService.getMyUser(user);
    const allowed = this.userService.isAuthorizedForDevice(
      dbUser,
      eventTableArgs.cli,
    );

    if (allowed) {
      return this.deviceService.getEvents(eventTableArgs);
    }

    throw new UnauthorizedException();
  }

  @AnyRole()
  @Mutation(() => Device)
  async addContactToDevice(
    @Args({
      name: 'addContactToDeviceInput',
      type: () => AddContactToDeviceInput,
    })
    addContactToDeviceInput: AddContactToDeviceInput,
    @CurrentUser()
    user: Record<string, string>,
  ) {
    const dbUser = await this.userService.getMyUser(user);
    const allowed = this.userService.isAuthorizedForDevice(
      dbUser,
      addContactToDeviceInput.cli,
    );

    if (allowed) {
      return this.deviceService.addContactToDevice(addContactToDeviceInput);
    }

    throw new UnauthorizedException();
  }

  @AnyRole()
  @Query(() => [DeviceContact], { name: 'getDeviceContacts' })
  async getDeviceContacts(
    @Args() getDeviceContactsArgs: GetDeviceContactsArgs,
    @CurrentUser() user: Record<string, string>,
  ) {
    const dbUser = await this.userService.getMyUser(user);
    const allowed = this.userService.isAuthorizedForDevice(
      dbUser,
      getDeviceContactsArgs.cli,
    );

    if (allowed) {
      return this.deviceService.getDeviceContacts(getDeviceContactsArgs.cli);
    }

    throw new UnauthorizedException();
  }

  @AnyRole()
  @Query(() => [DeviceContact], { name: 'myContacts' })
  async myContacts(@CurrentUser() user: Record<string, string>) {
    const dbUser = await this.userService.getMyUser(user);

    // Get user's devices
    const devices = await this.getUserDevices({
      uuid: dbUser.uuid,
    } as GetUserDevicesArgs);
    let contacts = [];

    // Get contacts for all devices
    for (const device of devices) {
      contacts = contacts.concat(
        await this.deviceService.getDeviceContacts(device.cli),
      );
    }

    return contacts;
  }

  @AnyRole()
  @Mutation(() => Device)
  async editContact(
    @Args({
      name: 'editContactInput',
      type: () => EditContactInput,
    })
    editContactInput: EditContactInput,
    @CurrentUser()
    user: Record<string, string>,
  ) {
    const dbUser = await this.userService.getMyUser(user);
    const allowed = this.userService.isAuthorizedForDevice(
      dbUser,
      editContactInput.cli,
    );

    if (allowed) {
      return this.deviceService.editContact(editContactInput);
    }

    throw new UnauthorizedException();
  }

  @AnyRole()
  @Mutation(() => Device)
  async deleteContact(
    @Args({
      name: 'deleteContactInput',
      type: () => DeleteContactInput,
    })
    deleteContactInput: DeleteContactInput,
    @CurrentUser()
    user: Record<string, string>,
  ) {
    const dbUser = await this.userService.getMyUser(user);
    const allowed = this.userService.isAuthorizedForDevice(
      dbUser,
      deleteContactInput.cli,
    );

    if (allowed) {
      return this.deviceService.deleteContact(deleteContactInput);
    }

    throw new UnauthorizedException();
  }

  /**
   * Get connection status logs for a device if the user has permission.
   * @param {GetConnectionLogsArgs} getConnectionLogsArgs - contains station CLI & number of logs to fetch / skip
   * @param {Record<string, string>} user - Cognito user from request.
   * @returns {Promise<LevelWriting>} - The level writings of the devices.
   */
  @AnyRole()
  @Query(() => [ConnectionLogEntry], { name: 'getConnectionLogs' })
  async getConnectionLogs(
    @Args() getConnectionLogsArgs: GetConnectionLogsArgs,
    @CurrentUser() user: Record<string, string>,
  ) {
    const dbUser = await this.userService.getMyUser(user);

    if (
      !this.userService.isAuthorizedForDevice(dbUser, getConnectionLogsArgs.cli)
    ) {
      throw new UnauthorizedException();
    }

    return this.deviceService.getConnectionLogs(getConnectionLogsArgs);
  }

  /**
   * Get the number of connection logs for a device
   * @param {GetConnectionLogCountArgs} getConnectionLogCountArgs - contains device CLI
   * @param {Record<string, string>} user - Cognito user from request.
   * @returns {Promise<LevelWriting>} - The level writings of the devices.
   */
  @AnyRole()
  @Query(() => Int, { name: 'getConnectionLogCount' })
  async getConnectionLogCount(
    @Args() getConnectionLogCountArgs: GetConnectionLogCountArgs,
    @CurrentUser() user: Record<string, string>,
  ) {
    const dbUser = await this.userService.getMyUser(user);

    if (
      !this.userService.isAuthorizedForDevice(
        dbUser,
        getConnectionLogCountArgs.cli,
      )
    ) {
      throw new UnauthorizedException();
    }

    return this.deviceService.getConnectionLogCount(
      getConnectionLogCountArgs.cli,
    );
  }

  /**
   * Get the device log entries for a device
   * @param {GetDeviceLogArgs} getDeviceLogArgs - contains station CLI
   * @param {Record<string, string>} user - Cognito user from request
   * @returns {Promise<DeviceLog>} - The logs of the device
   */
  @AnyRole()
  @Query(() => DeviceLog, { name: 'getDeviceLog' })
  async getDeviceLog(
    @Args() getDeviceLogArgs: GetDeviceLogArgs,
    @CurrentUser() user: Record<string, string>,
  ) {
    const dbUser = await this.userService.getMyUser(user);

    if (!this.userService.isAuthorizedForDevice(dbUser, getDeviceLogArgs.cli)) {
      throw new UnauthorizedException();
    }

    return this.deviceService.getDeviceLog(getDeviceLogArgs);
  }

  /**
   * Get the FTP log entries for a device
   * @param {GetDeviceLogArgs} getDeviceLogArgs - contains station CLI
   * @param {Record<string, string>} user - Cognito user from request
   * @returns {Promise<FTPLog>} - The logs of the device
   */
  @AnyRole()
  @Query(() => FTPLog, { name: 'getFTPLog' })
  async getFTPLog(
    @Args() getDeviceLogArgs: GetDeviceLogArgs,
    @CurrentUser() user: Record<string, string>,
  ) {
    const dbUser = await this.userService.getMyUser(user);

    if (!this.userService.isAuthorizedForDevice(dbUser, getDeviceLogArgs.cli)) {
      throw new UnauthorizedException();
    }

    return this.deviceService.getFTPLog(getDeviceLogArgs);
  }
}
