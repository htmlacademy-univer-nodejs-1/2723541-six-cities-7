import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import type { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { LoginUserRequest } from './login-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController...');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/logout', method: HttpMethod.Delete, handler: this.logout });
    this.addRoute({ path: '/status', method: HttpMethod.Get, handler: this.status });
    this.addRoute({ path: '/:userId/avatar', method: HttpMethod.Post, handler: this.uploadAvatar });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    const userResponse = fillDTO(UserRdo, {
      ...result.toObject(),
      id: result.id,
    });

    this.created(res, userResponse);
  }

  public async login(
    { body }: LoginUserRequest,
    _res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public logout(_req: Request, res: Response): void {
    this.noContent(res);
  }

  public status(_req: Request, _res: Response): never {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'User status requires authentication middleware',
      'UserController',
    );
  }

  public uploadAvatar(_req: Request, _res: Response): never {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Avatar upload requires multipart middleware',
      'UserController',
    );
  }
}
