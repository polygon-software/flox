import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { GetCommentArgs } from './dto/args/get-comment-args';
import { GetCommentsArgs } from './dto/args/get-comments-args';
import { CreateCommentInput } from './dto/input/create-comment.input';
import { UpdateCommentInput } from './dto/input/update-comment.input';
import { DeleteCommentInput } from './dto/input/delete-comment-input';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentInput: CreateCommentInput): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentInput);
    return this.commentRepository.save(comment);
  }

  getComments(getCommentsArgs: GetCommentsArgs): Promise<Comment[]> {
    if (getCommentsArgs.uuids !== undefined) {
      return this.commentRepository.findByIds(getCommentsArgs.uuids);
    } else {
      return this.commentRepository.find();
    }
  }

  getAllComments(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  getComment(getCommentArgs: GetCommentArgs): Promise<Comment> {
    return this.commentRepository.findOne(getCommentArgs.uuid);
  }

  async update(updateCommentInput: UpdateCommentInput): Promise<Comment> {
    const comment = this.commentRepository.create(updateCommentInput);
    await this.commentRepository.update(updateCommentInput.uuid, comment);
    return this.commentRepository.findOne(updateCommentInput.uuid);
  }

  async remove(deleteCommenetInput: DeleteCommentInput): Promise<Comment> {
    const comment = await this.commentRepository.findOne(
      deleteCommenetInput.uuid,
    );
    const uuid = comment.uuid;
    const deletedComment = await this.commentRepository.remove(comment);
    deletedComment.uuid = uuid;
    return deletedComment;
  }
}
