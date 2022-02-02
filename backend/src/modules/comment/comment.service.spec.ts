import { CommentService } from './comment.service';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

describe('CommentService', () => {
  let commentService: CommentService;
  let commentRepository: Repository<Comment>;

  beforeEach(async () => {
    commentRepository = new Repository<Comment>();

    commentService = new CommentService(commentRepository);
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });
});
