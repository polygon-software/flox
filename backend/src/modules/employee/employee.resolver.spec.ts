import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeResolver } from './employee.resolver';
import { EmployeeService } from './employee.service';
import { CompanyService } from '../company/company.service';

describe('EmployeeResolver', () => {
  let resolver: EmployeeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeResolver, EmployeeService, CompanyService],
    }).compile();

    resolver = module.get<EmployeeResolver>(EmployeeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
