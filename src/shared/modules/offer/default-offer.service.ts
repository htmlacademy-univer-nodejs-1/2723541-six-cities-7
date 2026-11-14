import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { CityName, Component, SortType } from '../../types/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_PREMIUM_OFFER_COUNT } from './offer.constant.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const { authorId, ...offerData } = dto;
    const createdOffer = await this.offerModel.create({
      ...offerData,
      author: authorId
    });
    this.logger.info(`Created offer with ID: ${createdOffer._id}`);
    return createdOffer;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const foundOffer = await this.offerModel
      .findById(offerId)
      .populate(['author'])
      .exec();
    if (foundOffer) {
      this.logger.info(`Found offer with ID: ${foundOffer._id}`);
    } else {
      this.logger.warn(`Offer with ID: ${offerId} not found`);
    }
    return foundOffer ?? null;
  }

  find(limit?: number | undefined): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .populate(['author'])
      .sort({ postDate: SortType.Down })
      .limit(limit ?? DEFAULT_OFFER_COUNT)
      .exec();
  }

  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['author'])
      .exec();
  }

  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public findPremium(city: CityName): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({
        'city.name': city,
        isPremium: true,
      })
      .populate(['author'])
      .sort({ postDate: SortType.Down })
      .limit(DEFAULT_PREMIUM_OFFER_COUNT)
      .exec();
  }

  public async updateRatingAndCommentCount(offerId: string, rating: number): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      return null;
    }

    const newCommentCount = offer.commentCount + 1;

    const newRating = Number((
      (
        offer.rating * offer.commentCount +
        rating
      ) / newCommentCount
    ).toFixed(1));

    return this.offerModel
      .findByIdAndUpdate(
        offerId,
        {
          $set: {
            rating: newRating,
          },
          $inc: {
            commentCount: 1,
          },
        },
        {
          new: true,
        }
      )
      .exec();
  }
}
