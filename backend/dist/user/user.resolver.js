"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const user_service_1 = require("./user.service");
const create_user_input_1 = require("./dto/input/create-user.input");
const update_user_input_1 = require("./dto/input/update-user.input");
const get_user_args_1 = require("./dto/args/get-user.args");
const delete_user_input_1 = require("./dto/input/delete-user.input");
const user_entity_1 = require("./entities/user.entity");
const get_users_args_1 = require("./dto/args/get-users.args");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubSub = new graphql_subscriptions_1.PubSub();
let UserResolver = class UserResolver {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getUsers(getUsersArgs) {
        return await this.usersService.getUsers(getUsersArgs);
    }
    async getAllUsers() {
        return await this.usersService.getAllUsers();
    }
    async getUser(getUserArgs) {
        return await this.usersService.getUser(getUserArgs);
    }
    async create(createUserInput) {
        const newUser = await this.usersService.create(createUserInput);
        await pubSub.publish('userAdded', { userAdded: newUser });
        console.log('Publishing new authentication', newUser, 'on PubSub!');
        return newUser;
    }
    async update(updateUserInput) {
        return await this.usersService.update(updateUserInput);
    }
    async remove(deleteUserInput) {
        return await this.usersService.remove(deleteUserInput);
    }
    userAdded() {
        return pubSub.asyncIterator('userAdded');
    }
};
__decorate([
    (0, graphql_1.Query)(() => [user_entity_1.User], { name: 'users' }),
    __param(0, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_users_args_1.GetUsersArgs]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    (0, graphql_1.Query)(() => [user_entity_1.User], { name: 'allUsers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getAllUsers", null);
__decorate([
    (0, graphql_1.Query)(() => user_entity_1.User, { name: 'user' }),
    __param(0, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_user_args_1.GetUserArgs]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    (0, graphql_1.Mutation)(() => user_entity_1.User),
    __param(0, (0, graphql_1.Args)('createUserInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_input_1.CreateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "create", null);
__decorate([
    (0, graphql_1.Mutation)(() => user_entity_1.User),
    __param(0, (0, graphql_1.Args)('updateUserInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_input_1.UpdateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "update", null);
__decorate([
    (0, graphql_1.Mutation)(() => user_entity_1.User),
    __param(0, (0, graphql_1.Args)('deleteUserInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_user_input_1.DeleteUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "remove", null);
__decorate([
    (0, graphql_1.Subscription)((returns) => user_entity_1.User),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "userAdded", null);
UserResolver = __decorate([
    (0, graphql_1.Resolver)(() => user_entity_1.User),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map