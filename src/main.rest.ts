import { Container } from 'inversify';
import { createUserContainer } from './shared/modules/user/user.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import 'reflect-metadata';
import { createRestContainer, RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
  );
  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
