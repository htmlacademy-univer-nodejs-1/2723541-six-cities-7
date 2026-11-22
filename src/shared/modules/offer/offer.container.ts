import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferEntity, OfferModel, OfferService } from './index.js';
import type { Controller } from '../../libs/rest/index.js';
import { OfferController } from './offer.controller.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService);
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();

  return offerContainer;
}
