import type { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import type { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import type { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import type { FavoriteService } from './favorite-service.interface.js';
import type { FavoriteEntity } from './favorite.entity.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) {}

  public findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]> {
    return this.favoriteModel
      .find({ userId })
      .populate({
        path: 'offerId',
        populate: {
          path: 'author',
        },
      })
      .exec();
  }

  public async add(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>> {
    const favorite = await this.favoriteModel
      .findOneAndUpdate(
        {
          userId: dto.userId,
          offerId: dto.offerId,
        },
        {
          $setOnInsert: {
            userId: dto.userId,
            offerId: dto.offerId,
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )
      .populate({
        path: 'offerId',
        populate: {
          path: 'author',
        },
      })
      .exec();

    if (!favorite) {
      throw new Error('Failed to add offer to favorites');
    }

    this.logger.info(`Offer ${dto.offerId} added to favorites for user ${dto.userId}`);
    return favorite;
  }

  public async remove(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity> | null> {
    const favorite = await this.favoriteModel
      .findOne({
        userId: dto.userId,
        offerId: dto.offerId,
      })
      .exec();

    if (favorite) {
      await favorite.deleteOne();
      this.logger.info(`Offer ${dto.offerId} removed from favorites for user ${dto.userId}`);
    }

    return favorite;
  }

  public async exists(dto: CreateFavoriteDto): Promise<boolean> {
    const favorite = await this.favoriteModel
      .exists({
        userId: dto.userId,
        offerId: dto.offerId,
      });

    return favorite !== null;
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.favoriteModel
      .deleteMany({ offerId })
      .exec();

    this.logger.info(`Deleted ${result.deletedCount} favorite records for offer ${offerId}`);
    return result.deletedCount;
  }
}
