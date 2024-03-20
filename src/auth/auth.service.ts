import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByCode(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      username: user.username,
      code: user.code,
      photo: user.photo,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      name: user.name,
      photo: user.photo,
      code: user.code,
      expire_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    };
  }
}
