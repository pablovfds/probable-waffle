import { Injectable } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PlaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlaceDto: CreatePlaceDto) {
    const data = {
      name: createPlaceDto.name,
      latitude: createPlaceDto.latitude,
      longitude: createPlaceDto.longitude,
      radius: createPlaceDto.radius,
      parentId: createPlaceDto.parentId,
    };

    const place = await this.prisma.place.create({
      data: data,
    });
    console.log(`Place created: ${JSON.stringify(place)}`);
    if (place.parentId) {
      await this.prisma.place.update({
        where: {
          id: place.parentId,
        },
        data: {
          children: {
            connect: {
              id: place.id,
            },
          },
        },
      });
      console.log(`Place parent updated: ${JSON.stringify(place)}`);
    }
    return place;
  }

  async findAll() {
    return await this.prisma.place.findMany({
      include: {
        children: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.place.findUnique({
      where: {
        id,
      },
      include: {
        children: true,
      },
    });
  }

  // update(id: number, updatePlaceDto: UpdatePlaceDto) {
  //   return `This action updates a #${id} place`;
  // }

  async remove(id: number) {
    const place = this.findOne(id);
    if (!place) {
      throw new Error(`Place ${id} not found`);
    }

    await this.prisma.place.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });
  }
}
