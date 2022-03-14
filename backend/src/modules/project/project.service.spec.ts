import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { UserService } from '../user/user.service';

describe('ProjectService', () => {
  let userRepository: Repository<User>;
  let projectService: ProjectService;
  let projectRepository: Repository<Project>;
  let userService: UserService;

  beforeEach(async () => {
    userRepository = new Repository<User>();
    projectRepository = new Repository<Project>();
    userService = new UserService(userRepository);
    projectService = new ProjectService(
      projectRepository,
      userRepository,
      userService,
    );
  });

  it('should be defined', () => {
    expect(projectService).toBeDefined();
  });
});
