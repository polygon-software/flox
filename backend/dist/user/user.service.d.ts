import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { GetUsersArgs } from './dto/args/get-users.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserInput: CreateUserInput): Promise<User>;
    getUsers(getUsersArgs: GetUsersArgs): Promise<User[]>;
    getAllUsers(): Promise<User[]>;
    getUser(getUserArgs: GetUserArgs): Promise<User>;
    update(updateUserInput: UpdateUserInput): Promise<User>;
    remove(deleteUserInput: DeleteUserInput): Promise<User>;
}
