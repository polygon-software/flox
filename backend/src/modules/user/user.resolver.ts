import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { GetUserArgs } from './dto/args/get-user.args';
import { PersonType, User } from './entities/user.entity';
import { GetUsersArgs } from './dto/args/get-users.args';
import {
  AdminOnly,
  AnyRole,
  CurrentUser,
  Roles,
} from '../../auth/authorization.decorator';
import { DisableUserInput } from './dto/input/disable-user.input';
import { Person } from '../person/entities/person.entity';
import { ROLE } from '../../ENUM/ENUMS';
import { ERRORS } from '../../error/ERRORS';
import { EmployeeService } from '../employee/employee.service';
import { CompanyService } from '../company/company.service';
import { GetCompanyArgs } from '../company/dto/args/get-company.args';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
    private readonly companyService: CompanyService,
  ) {}

  @AdminOnly()
  @Query(() => [User], { name: 'users' })
  async getUsers(@Args() getUsersArgs: GetUsersArgs): Promise<User[]> {
    return this.userService.getUsers(getUsersArgs);
  }

  @AdminOnly()
  @Query(() => [User], { name: 'allUsers' })
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @AdminOnly()
  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return this.userService.getUser(getUserArgs);
  }

  @AnyRole()
  @Query(() => User, { name: 'getMyUser' })
  async getMyUser(@CurrentUser() user: Record<string, string>): Promise<User> {
    if (!user) {
      throw new Error('No User authenticated');
    }

    return this.userService.getUser({ uuid: user.userId });
  }

  @AnyRole()
  @Mutation(() => User, { name: 'verifyEmail' })
  async verifyEmail(
    @CurrentUser() user: Record<string, string>,
  ): Promise<User> {
    const provider = new CognitoIdentityProvider({
      region: process.env.AWS_REGION ?? 'eu-central-1',
    });
    const res = await provider.resendConfirmationCode({
      Username: user.userId,
      ClientId: process.env.USER_POOL_CLIENT_ID,
    });
    console.log(res);
    return this.userService.getUser({ uuid: user.userId });
  }

  /**
   * Disables a given user's account
   * @param {DisableUserInput} disableUserInput - disabling input, including UUID & role
   * @param {Record<string, unknown>} user - the user making the request
   * @returns {Promise<User>} - the user after editing
   */
  @Roles(ROLE.COMPANY, ROLE.SOI_ADMIN)
  @Mutation(() => PersonType)
  async disableUser(
    @Args('disableUserInput') disableUserInput: DisableUserInput,
    @CurrentUser() user: Record<string, string>,
  ): Promise<Person> {
    // Determine if combination of role & user type is valid
    const dbUser = await this.userService.getUser({ uuid: user.userId });
    if (
      dbUser.role !== ROLE.SOI_ADMIN &&
      !(dbUser.role === ROLE.COMPANY && disableUserInput.role === ROLE.EMPLOYEE)
    ) {
      throw new Error(ERRORS.no_permission_to_disable);
    }

    // Check if company is disabling its own employee
    if (dbUser.role === ROLE.COMPANY) {
      // Get company
      const company = await this.companyService.getCompany({
        uuid: dbUser.fk,
      } as GetCompanyArgs);

      if (!company) {
        throw new Error(ERRORS.no_permission_to_disable);
      }

      // Get employees
      const companyEmployees = await this.employeeService.getEmployees(company);
      if (
        !companyEmployees ||
        !companyEmployees.find(
          (employee) => employee.uuid === disableUserInput.uuid,
        )
      ) {
        throw new Error(ERRORS.no_permission_to_disable);
      }
    }

    let repository;

    // Depending on role of the user to ban, pass corresponding repository to service
    switch (disableUserInput.role) {
      case ROLE.BANK:
        repository = 'bankRepository';
        break;
      case ROLE.COMPANY:
        repository = 'companyRepository';
        break;
      case ROLE.SOI_EMPLOYEE:
        repository = 'soiEmployeeRepository';
        break;
      case ROLE.EMPLOYEE:
        repository = 'employeeRepository';
        break;
      default:
        throw new Error(ERRORS.invalid_user_type);
    }

    return this.userService.disableUser(disableUserInput.uuid, repository);
  }
}
