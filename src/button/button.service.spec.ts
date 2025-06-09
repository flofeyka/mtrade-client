import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ButtonService } from './button.service';

describe('ButtonService', () => {
  let service: ButtonService;

  const mockPrisma = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ButtonService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ButtonService>(ButtonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
