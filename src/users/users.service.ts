import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

export type User = any;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findUserByCode(code: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { code },
      include: { surveys: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.surveyCount = user.surveys.length;
    user.doneSurveys = user.surveys.filter((survey) => survey.goalCount === survey.goalTotal).length;

    return user;
  }

  async createUser(body: CreateUserDto): Promise<User> {
    const { name, photo, password } = body;

    return await this.prisma.user.create({
      data: {
        name,
        code: this.generateRandomString(6),
        password, // Add the 'password' property
        photo,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });
  }

  async addSurveyToUser(userCode: string, surveyId: number) {
    const user = await this.findUserByCode(userCode);

    if (!user) {
      throw new Error('User not found');
    }

    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        surveys: {
          connect: { id: surveyId },
        },
      },
    });
  }

  async truncate(): Promise<void> {
    await this.prisma.user.deleteMany();
  }

  private generateRandomString = (length) => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
}
