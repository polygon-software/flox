import { UserService } from './user.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { User } from './entities/user.entity';
import { GetUsersArgs } from './dto/args/get-users.args';
export declare class UserResolver {
    private readonly usersService;
    constructor(usersService: UserService);
    getUsers(getUsersArgs: GetUsersArgs): Promise<User[]>;
    getAllUsers(): Promise<User[]>;
    getUser(getUserArgs: GetUserArgs): Promise<User>;
    create(createUserInput: CreateUserInput): Promise<User>;
    update(updateUserInput: UpdateUserInput): Promise<User>;
    remove(deleteUserInput: DeleteUserInput): Promise<User>;
}
