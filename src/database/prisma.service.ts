import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  prisma = new PrismaClient();

  async onModuleInit() {
    await this.prisma.$connect();
  }
}
