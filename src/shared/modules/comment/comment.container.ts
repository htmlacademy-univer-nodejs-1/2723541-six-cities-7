import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { CommentEntity, CommentModel, DefaultCommentService } from './index.js';

export function createCommentContainer() {
  const commentContainer = new Container();
  commentContainer.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

  return commentContainer;
}
