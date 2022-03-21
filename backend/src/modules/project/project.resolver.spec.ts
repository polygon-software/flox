import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

describe('ProjectsResolver', () => {
  let projectResolver: ProjectResolver;
  let projectService: ProjectService;
  let projectRepository: Repository<Project>;
  let userRepository: Repository<User>;
  let userService: UserService;

  beforeEach(async () => {
    userRepository = new Repository<User>();
    userService = new UserService(userRepository);
    projectRepository = new Repository<Project>();
    projectService = new ProjectService(
      projectRepository,
      userRepository,
      userService,
    );
    projectResolver = new ProjectResolver(projectService, userService);
  });

  it('should be defined', () => {
    expect(projectResolver).toBeDefined();
  });
});
