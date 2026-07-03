import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // Get /user
    @Get()
    getUsers(@Query('name') name: string) {
        return this.userService.findAllUsers(name);
        // const users = [
        //     { id: 1, name: 'John Doe' },
        //     { id: 1, name: 'Adrian' },
        // ];

        // if (name) {
        //     return users.filter((user) =>
        //         user.name.toLowerCase().includes(name.toLowerCase
        //             ()),
        //     );
        // }
        // return users;
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        return { id, name: 'John Doe' };
    }

    @Post() // POST /user
    createUser(@Body() CreateUserDto: CreateUserDto) {
        // return { message: 'User created successfully'};
        return { data: CreateUserDto, message: 'User created successfully' };
    }

    @Put() // PUT /user/:id
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return {
            data: { id, ...updateUserDto },
            message: 'User updated successfully',
        };
    }
}
