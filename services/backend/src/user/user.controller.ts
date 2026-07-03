import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
    // Get /user
    @Get()
    getUsers() {
        return [
            { id: 1, name: 'John Doe' },
            { id: 1, name: 'Adrian' },
        ];
    }
}
