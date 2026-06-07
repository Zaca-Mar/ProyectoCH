import { Test, TestingModule } from '@nestjs/testing';
import { TalleService } from './talle.service';

describe('TalleService', () => {
  let service: TalleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TalleService],
    }).compile();

    service = module.get<TalleService>(TalleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
