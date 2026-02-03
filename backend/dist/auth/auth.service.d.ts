import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            name: any;
            role: any;
            department: any;
        };
    }>;
    register(userData: any): Promise<User[]>;
    getUserById(id: number): Promise<User | null>;
    refreshToken(user: any): Promise<{
        access_token: string;
    }>;
}
