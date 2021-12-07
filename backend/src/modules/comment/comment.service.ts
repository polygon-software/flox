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
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async create(createCommentInput: CreateCommentInput): Promise<Comment> {
    const comment = await this.commentsRepository.create(createCommentInput);
    return this.commentsRepository.save(comment);
  }

  getComments(getCommentsArgs: GetCommentsArgs): Promise<Comment[]> {
    if (getCommentsArgs.uuids !== undefined) {
      return this.commentsRepository.findByIds(getCommentsArgs.uuids);
    } else {
      return this.commentsRepository.find();
    }
  }

  getAllComments(): Promise<Comment[]> {
    return this.commentsRepository.find();
  }

  getComment(getCommentArgs: GetCommentArgs): Promise<Comment> {
    return this.commentsRepository.findOne(getCommentArgs.uuid);
  }

  async update(updateCommentInput: UpdateCommentInput): Promise<Comment> {
    const comment = await this.commentsRepository.create(updateCommentInput);
    await this.commentsRepository.update(updateCommentInput.uuid, comment);
    return this.commentsRepository.findOne(updateCommentInput.uuid);
  }

  async remove(deleteCommenetInput: DeleteCommentInput): Promise<Comment> {
    const comment = await this.commentsRepository.findOne(
      deleteCommenetInput.uuid,
    );
    const uuid = comment.uuid;
    const deleted_comment = await this.commentsRepository.remove(comment);
    deleted_comment.uuid = uuid;
    return deleted_comment;
  }
}
