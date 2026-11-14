import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { Component, SortType } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { DEFAULT_COMMENT_COUNT } from './comment.constant.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import type { OfferService } from '../offer/index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const offer = await this.offerService.findById(dto.offerId);

    if (!offer) {
      throw new Error(`Offer with ID ${dto.offerId} not found`);
    }

    const comment = await this.commentModel.create(dto);

    await this.offerService.updateRatingAndCommentCount(
      dto.offerId,
      dto.rating
    );

    this.logger.info(`Created comment with ID: ${comment._id}`);

    return comment.populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    const comments = await this.commentModel
      .find({ offerId })
      .populate('userId')
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_COMMENT_COUNT)
      .exec();

    this.logger.info(`Found ${comments.length} comments for offer ID: ${offerId}`);
    return comments;
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({ offerId })
      .exec();

    this.logger.info(
      `Deleted ${result.deletedCount} comments for offer ID: ${offerId}`
    );

    return result.deletedCount;
  }
}
