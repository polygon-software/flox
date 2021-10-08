import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import {GetUserArgs} from "./dto/args/get-user.args";
import {User} from "../graphql";
import { v4 as uuidv4 } from "uuid"
import {GetUsersArgs} from "./dto/args/get-users.args";
import {DeleteUserInput} from "./dto/input/delete-user.input";

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(createUserInput: CreateUserInput): User {
    const user: User = {
      userId: uuidv4(),
      ...createUserInput
    }

    this.users.push(user);
    return user;
  }

  getUsers(getUsersArgs: GetUsersArgs) {
    return getUsersArgs.userIds.map(userId => this.getUser({ userId }))
  }

  getUser(getUserArgs: GetUserArgs) {
    return this.users.find(user => user.userId === getUserArgs.userId);
  }

  update(updateUserInput: UpdateUserInput): User {
    const user = this.users.find(user => user.userId  === updateUserInput.userId)

    // Update given data
    Object.assign(user, updateUserInput)

    return user;
  }

  remove(deleteUserInput: DeleteUserInput) {
    const user_index = this.users.findIndex(user => user.userId === deleteUserInput.userId)
    const user = this.users[user_index];
    this.users.splice(user_index);

    return user;
  }
}
