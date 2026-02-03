import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      return { message: 'Invalid credentials' };
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

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout() {
    // In JWT, logout is typically handled on the client side by removing the token
    return { message: 'Logout successful' };
  }
}
