import { Test, TestingModule } from '@nestjs/testing';
import { GlobiService } from './globi.service';

describe('GlobiService', () => {
  let service: GlobiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobiService],
    }).compile();

    service = module.get<GlobiService>(GlobiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
