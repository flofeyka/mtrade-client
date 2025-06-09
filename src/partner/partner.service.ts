import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerRdo, PartnerListRdo } from './rdo/partner.rdo';
import {
  transformToSingleRdo,
  transformToArrayRdo,
} from '../common/utils/transform.util';
import { Prisma } from '@prisma/client';
import { FindPartnersDto } from './dto/find-partners.dto';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePartnerDto): Promise<PartnerRdo> {
    const existingPartner = await this.prisma.partner.findFirst({
      where: {
        OR: [{ username: dto.username }, { code: dto.code }],
      },
    });

    if (existingPartner) {
      if (existingPartner.username === dto.username) {
        throw new ConflictException('Партнер с таким username уже существует');
      }
      if (existingPartner.code === dto.code) {
        throw new ConflictException('Партнер с таким кодом уже существует');
      }
    }

    const partner = await this.prisma.partner.create({
      data: dto,
    });

    return transformToSingleRdo(PartnerRdo, partner);
  }

  async findAll(dto: FindPartnersDto): Promise<PartnerListRdo> {
    const where: Prisma.PartnerWhereInput = {};

    if (dto.search) {
      where.username = {
        contains: dto.search.toLowerCase(),
      };
    }

    const partners = await this.prisma.partner.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where,
    });

    return {
      partners: transformToArrayRdo(PartnerRdo, partners),
      total: partners.length,
    };
  }

  async findOne(id: number): Promise<PartnerRdo> {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`Партнер с ID ${id} не найден`);
    }

    return transformToSingleRdo(PartnerRdo, partner);
  }

  async update(id: number, dto: UpdatePartnerDto): Promise<PartnerRdo> {
    // Проверяем существует ли партнер
    await this.findOne(id);

    // Проверяем уникальность username и code если они обновляются
    if (dto.username || dto.code) {
      const orConditions: Array<{ username?: string; code?: string }> = [];
      if (dto.username) {
        orConditions.push({ username: dto.username });
      }
      if (dto.code) {
        orConditions.push({ code: dto.code });
      }

      const existingPartner = await this.prisma.partner.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: orConditions,
            },
          ],
        },
      });

      if (existingPartner) {
        if (existingPartner.username === dto.username) {
          throw new ConflictException(
            'Партнер с таким username уже существует',
          );
        }
        if (existingPartner.code === dto.code) {
          throw new ConflictException('Партнер с таким кодом уже существует');
        }
      }
    }

    const partner = await this.prisma.partner.update({
      where: { id },
      data: dto,
    });

    return transformToSingleRdo(PartnerRdo, partner);
  }

  async remove(id: number): Promise<PartnerRdo> {
    // Проверяем существует ли партнер
    await this.findOne(id);

    const partner = await this.prisma.partner.delete({
      where: { id },
    });

    return transformToSingleRdo(PartnerRdo, partner);
  }

  async findByCode(code: string): Promise<PartnerRdo | null> {
    const partner = await this.prisma.partner.findFirst({
      where: { code },
    });

    if (!partner) {
      return null;
    }

    return transformToSingleRdo(PartnerRdo, partner);
  }

  async findByUsername(username: string): Promise<PartnerRdo | null> {
    const partner = await this.prisma.partner.findFirst({
      where: { username },
    });

    if (!partner) {
      return null;
    }

    return transformToSingleRdo(PartnerRdo, partner);
  }
}
