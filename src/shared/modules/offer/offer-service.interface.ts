import type { DocumentType } from '@typegoose/typegoose';
import type { CityName } from '../../types/index.js';
import type { CreateOfferDto } from './dto/create-offer.dto.js';
import type { UpdateOfferDto } from './dto/update-offer.dto.js';
import type { OfferEntity } from './offer.entity.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  find(limit?: number): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremium(city: CityName): Promise<DocumentType<OfferEntity>[]>;
  updateRatingAndCommentCount(offerId: string, rating: number): Promise<DocumentType<OfferEntity> | null>;
}
