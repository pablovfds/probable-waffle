import { Controller, Get, Delete, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<any[]> {
    return this.usersService.findAll();
  }

  @Delete('all')
  async truncate(): Promise<void> {
    await this.usersService.truncate();
  }

  @Public()
  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<any> {
    return this.usersService.createUser(body);
  }

  @Get(':code')
  async findUserByCode(@Param('code') code: string): Promise<any> {
    return this.usersService.findUserByCode(code);
  }
}
