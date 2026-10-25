import 'reflect-metadata';
import { createRestContainer, RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';

async function bootstrap() {
  const container = createRestContainer();
  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
