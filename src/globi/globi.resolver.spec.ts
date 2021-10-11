import { Test, TestingModule } from '@nestjs/testing';
import { GlobiResolver } from './globi.resolver';
import { GlobiService } from './globi.service';

describe('GlobiResolver', () => {
  let resolver: GlobiResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobiResolver, GlobiService],
    }).compile();

    resolver = module.get<GlobiResolver>(GlobiResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
