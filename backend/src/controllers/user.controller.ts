import { Controller, Get, Post } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { UserService } from "src/services/user.service";

@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService) {}


    @Get('/')
    async findAll() {
        return await this.userService.findAll();
    }

    @Post('/')
    async create() {
        const user = new User();
        user.firstName = 'test';
        user.lastName = 'test';
        return await this.userService.create(user);
    }
}