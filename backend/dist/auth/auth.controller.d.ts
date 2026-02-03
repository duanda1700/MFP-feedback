import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
        };
    } | {
        message: string;
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
