import { Test, TestingModule } from '@nestjs/testing';
import { ButtonController } from './button.controller';
import { ButtonService } from './button.service';

describe('ButtonController', () => {
  let controller: ButtonController;

  const mockButtonService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ButtonController],
      providers: [{ provide: ButtonService, useValue: mockButtonService }],
    }).compile();

    controller = module.get<ButtonController>(ButtonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
