import { Container } from 'inversify';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/mongo.database-client.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { AppExceptionFilter, ExceptionFilter } from '../shared/libs/rest/index.js';
import { Component } from '../shared/types/index.js';
import { RestApplication } from './rest.application.js';

export function createRestContainer(): Container {
  const container = new Container();

  container.bind<RestApplication>(Component.RestApplication)
    .to(RestApplication)
    .inSingletonScope();
  container.bind<Logger>(Component.Logger)
    .to(PinoLogger)
    .inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config)
    .to(RestConfig)
    .inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient)
    .to(MongoDatabaseClient)
    .inSingletonScope();
  container.bind<ExceptionFilter>(Component.ExceptionFilter)
    .to(AppExceptionFilter)
    .inSingletonScope();

  return container;
}
