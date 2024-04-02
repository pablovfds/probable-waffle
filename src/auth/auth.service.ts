import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByCode(username);
    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      username: user.username,
      code: user.code,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      name: user.name,
      photo: user.photo,
      code: user.code,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    };
  }

  async forgotPassword(email: string, userCode: string) {
    const user = await this.usersService.findUserByCode(userCode);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email !== email) {
      throw new BadRequestException('Email does not match');
    }

    return user;
  }
}
