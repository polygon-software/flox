import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/input/create-comment.input';
import { UpdateCommentInput } from './dto/input/update-comment.input';
import { PubSub } from 'graphql-subscriptions';
import { Public } from '../../auth/authentication.decorator';
import { GetCommentsArgs } from './dto/args/get-comments-args';
import { GetCommentArgs } from './dto/args/get-comment-args';
import { DeleteCommentInput } from './dto/input/delete-comment-input';

// Publish/subscribe handler TODO make global and inject/provide, according to https://docs.nestjs.com/graphql/subscriptions
const pubSub = new PubSub();


@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Query(() => [Comment], { name: 'comments' })
  async getComments(
    @Args() getCommentsArgs: GetCommentsArgs,
  ): Promise<Comment[]> {
    return await this.commentService.getComments(getCommentsArgs);
  }

  @Public()
  @Query(() => [Comment], { name: 'allComments' })
  async getAllComments(): Promise<Comment[]> {
    return await this.commentService.getAllComments();
  }

  @Public()
  @Query(() => Comment, { name: 'comment' })
  async getComment(@Args() getCommentArgs: GetCommentArgs): Promise<Comment> {
    return await this.commentService.getComment(getCommentArgs);
  }

  @Public()
  @Mutation(() => Comment)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ): Promise<Comment> {
    const newComment = await this.commentService.create(createCommentInput);
    // Publish authentication so subscriptions will auto-update
    await pubSub.publish('commentAdded', { commentAdded: newComment });
    return newComment;
  }

  @Public()
  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ): Promise<Comment> {
    return await this.commentService.update(updateCommentInput);
  }

  @Public()
  @Mutation(() => Comment)
  async removeComment(
    @Args('deleteCommentInput') deleteCommentInput: DeleteCommentInput,
  ): Promise<Comment> {
    return await this.commentService.remove(deleteCommentInput);
  }

  @Public()
  @Subscription(() => Comment)
  commentAdded(): AsyncIterator<unknown, any, undefined> {
    return pubSub.asyncIterator('commentAdded');
  }
}
