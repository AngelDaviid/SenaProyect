import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {User} from "../../users/entities/user.entity"
import {Payload} from "../models/payload.model";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
              private jwtService: JwtService) {
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.getUserbyEmail(email);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  generateToken(user: User) {
    const payload: Payload = {sub: user.id};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}


