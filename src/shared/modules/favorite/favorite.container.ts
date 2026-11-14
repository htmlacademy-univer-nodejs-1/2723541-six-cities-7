import type { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { DefaultFavoriteService } from './default-favorite.service.js';
import type { FavoriteService } from './favorite-service.interface.js';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';

export function createFavoriteContainer() {
  const favoriteContainer = new Container();

  favoriteContainer.bind<FavoriteService>(Component.FavoriteService).to(DefaultFavoriteService).inSingletonScope();
  favoriteContainer.bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel).toConstantValue(FavoriteModel);

  return favoriteContainer;
}
