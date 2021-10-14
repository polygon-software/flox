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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
let UserService = class UserService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserInput) {
        const user = await this.usersRepository.create(createUserInput);
        return await this.usersRepository.save(user);
    }
    async getUsers(getUsersArgs) {
        if (getUsersArgs.userIds !== undefined) {
            return await this.usersRepository.findByIds(getUsersArgs.userIds);
        }
        else {
            return await this.usersRepository.find();
        }
    }
    async getAllUsers() {
        return await this.usersRepository.find();
    }
    async getUser(getUserArgs) {
        return await this.usersRepository.findOne(getUserArgs.userId);
    }
    async update(updateUserInput) {
        const user = await this.usersRepository.create(updateUserInput);
        await this.usersRepository.update(updateUserInput.userId, user);
        return await this.usersRepository.findOne(updateUserInput.userId);
    }
    async remove(deleteUserInput) {
        const user = await this.usersRepository.findOne(deleteUserInput.userId);
        const id = user.id;
        const delUser = await this.usersRepository.remove(user);
        delUser.id = id;
        return delUser;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map