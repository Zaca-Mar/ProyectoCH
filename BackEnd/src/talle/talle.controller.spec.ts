import { Test, TestingModule } from '@nestjs/testing';
import { TalleController } from './talle.controller';
import { TalleService } from './talle.service';

describe('TalleController', () => {
  let controller: TalleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalleController],
      providers: [TalleService],
    }).compile();

    controller = module.get<TalleController>(TalleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
