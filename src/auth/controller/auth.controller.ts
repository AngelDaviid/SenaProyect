import {Controller, Post, UseGuards, Req} from '@nestjs/common';
import type {Request} from "express";
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from '../service/auth.service';
import {User} from "../../users/entities/user.entity";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    return {
      user,
      access_token: this.authService.generateToken(user),
    };
  }

}
