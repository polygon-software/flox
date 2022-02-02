import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

describe('CommentResolver', () => {
  let commentResolver: CommentResolver;
  let commentService: CommentService;
  let commentRepository: Repository<Comment>;

  beforeEach(async () => {
    commentRepository = new Repository<Comment>();

    commentService = new CommentService(commentRepository);

    commentResolver = new CommentResolver(commentService);
  });

  it('should be defined', () => {
    expect(commentResolver).toBeDefined();
  });
});
