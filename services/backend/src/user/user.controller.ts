import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // Get /user
    @Get()
    getUsers(@Query('name') name: string) {
        return this.userService.findAllUsers(name);
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        // return { id, name: 'John Doe' };
        return this.userService.findOneUser(Number(id));
    }

    @Post() // POST /user
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Put(':id') // PUT /user/:id
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(Number(id), updateUserDto);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(Number(id));
    }
}
