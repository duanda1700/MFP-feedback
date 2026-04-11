import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(loginDto: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            name: any;
            role: any;
            department: any;
            supplierId: any;
        };
    }>;
    register(registerDto: {
        username: string;
        password: string;
        name: string;
        role: string;
        department?: string;
    }): Promise<import("./entities/user.entity").User[]>;
    getProfile(req: any): Promise<any>;
    refreshToken(req: any): Promise<{
        access_token: string;
    }>;
    logout(): Promise<{
        message: string;
    }>;
}
