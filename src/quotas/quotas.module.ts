import { Module } from '@nestjs/common';
import { QuotasService } from './quotas.service';
import { QuotasController } from './quotas.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [QuotasController],
  providers: [QuotasService, PrismaService],
})
export class QuotasModule {}
