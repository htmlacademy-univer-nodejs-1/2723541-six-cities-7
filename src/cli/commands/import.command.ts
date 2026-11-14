import chalk from 'chalk';
import { getErrorMessage } from '../../shared/helpers/common.js';
import { createOffer } from '../../shared/helpers/offer.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { DefaultUserService, UserModel, UserService } from '../../shared/modules/user/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { Command } from './command.interface.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';
import { Offer } from '../../shared/types/index.js';
import { DEFAULT_USER_PASSWORD, DEFAULT_DB_PORT } from './command.constant.js';
import { getMongoURI } from '../../shared/helpers/database.js';
import { CommentModel } from '../../shared/modules/comment/index.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel, CommentModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedLine(
    line: string,
    resolve: () => void,
    reject: (error: unknown) => void
  ): Promise<void> {
    try {
      const offer = createOffer(line);
      await this.saveOffer(offer);
      resolve();
    } catch (error) {
      reject(error);
    }
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD}, this.salt);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { author, ...offerData } = offer;

    await this.offerService.create({
      ...offerData,
      authorId: user.id
    });
  }

  private onCompleteImport(count: number) {
    console.info(`${count} строк импортировано`);
  }

  public async execute(fileName: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    if (!fileName || !login || !password || !host || !dbname || !salt) {
      console.error(chalk.red('Не все параметры указаны (файл, логин, пароль, хост, база данных, соль)'));
      return;
    }

    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);


    const fileReader = new TSVFileReader(fileName.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Ошибка при чтении файла: ${fileName}`);
      console.error(getErrorMessage(error));
    } finally {
      await this.databaseClient.disconnect();
    }
  }
}
