import { Injectable } from '@nestjs/common';
import { LoggerService } from './user.logger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface User {
    id: number;
    name: string;
    email: string;
}

// findOneUser(id: number)
// createUser(dto: CreateUserDto)
// updateUser(id: number, dto: UpdateUserDto)
// deleteUser(id: number)
@Injectable()
export class UserService {
    constructor(private readonly logger: LoggerService) {}
    private users: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    ];

    findAllUsers(name: string = '') {
        this.logger.log('Finding all users');

        return this.users.filter((user) =>
            user.name.toLowerCase().includes(name.toLowerCase()),
        );
    }

    findOneUser(id: number) {
        this.logger.log(`Finding user ${id}`);

        return this.users.find((user) => user.id === id) ?? null;
    }

    createUser(dto: CreateUserDto) {
        this.logger.log('Create user');

        const newUser: User = { id: this.users.length + 1, email: '', ...dto };
        this.users.push(newUser);

        return newUser;
    }

    updateUser(id: number, dto: UpdateUserDto) {
        this.logger.log(`Updateing user ${id}`);

        const index = this.users.findIndex((user) => user.id === id);
        if (index === -1) return null;

        this.users[index] = { ...this.users[index], ...dto };

        return this.users[index];
    }

    deleteUser(id: number) {
        this.logger.log(`Deleting user ${id}`);

        const index = this.users.findIndex((user) => user.id === id);
        if (index === -1) return null;

        const [deleted] = this.users.splice(index, 1);

        return deleted;
    }

}
