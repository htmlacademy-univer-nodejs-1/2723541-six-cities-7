import type { DocumentType } from '@typegoose/typegoose';
import type { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import type { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteService {
  findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  add(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>>;
  remove(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity> | null>;
  exists(dto: CreateFavoriteDto): Promise<boolean>;
  deleteByOfferId(offerId: string): Promise<number>;
}
