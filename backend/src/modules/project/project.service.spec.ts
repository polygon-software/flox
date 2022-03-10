import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';

describe('ProjectService', () => {
  let userRepository: Repository<User>;
  let projectService: ProjectService;
  let projectRepository: Repository<Project>;

  beforeEach(async () => {
    userRepository = new Repository<User>();
    projectRepository = new Repository<Project>();
    projectService = new ProjectService(projectRepository, userRepository);
  });

  it('should be defined', () => {
    expect(projectService).toBeDefined();
  });
});
