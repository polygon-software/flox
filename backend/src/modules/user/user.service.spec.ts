import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CompanyService } from '../company/company.service';
import { EmployeeService } from '../employee/employee.service';

describe('UsersService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, CompanyService, EmployeeService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
