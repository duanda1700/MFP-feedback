import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: { username: string; password: string; name: string; role: string; department?: string }) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Post('refresh')
  async refreshToken(@Request() req) {
    // 从请求头中获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return { message: 'No token provided' };
    }
    
    const token = authHeader.replace('Bearer ', '');
    try {
      // 验证 token 是否有效
      const decoded = this.jwtService.verify(token, { secret: 'your-secret-key' });
      const user = await this.authService.getUserById(decoded.sub);
      if (!user) {
        return { message: 'User not found' };
      }
      return this.authService.refreshToken(user);
    } catch (error) {
      return { message: 'Invalid token' };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout() {
    // In JWT, logout is typically handled on the client side by removing the token
    return { message: 'Logout successful' };
  }
}
