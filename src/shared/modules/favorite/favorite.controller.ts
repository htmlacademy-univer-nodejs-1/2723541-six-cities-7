import { isDocument } from '@typegoose/typegoose';
import type { DocumentType } from '@typegoose/typegoose';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/index.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import type { OfferEntity, OfferService } from '../offer/index.js';
import { OfferListItemRdo } from '../offer/index.js';
import { Component } from '../../types/index.js';
import type { FavoriteService } from './favorite-service.interface.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.FavoriteService) private readonly favoriteService: FavoriteService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for FavoriteController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.getList });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Put, handler: this.add });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.remove });
  }

  private getUserId(res: Response): string {
    const { userId } = res.locals;

    if (typeof userId !== 'string') {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Authentication required.',
        'FavoriteController',
      );
    }

    return userId;
  }

  private createOfferNotFoundError(offerId: string): HttpError {
    return new HttpError(
      StatusCodes.NOT_FOUND,
      `Offer with ID ${offerId} not found.`,
      'FavoriteController',
    );
  }

  private toOfferListItemRdo(
    offer: DocumentType<OfferEntity>,
    isFavorite: boolean,
  ): OfferListItemRdo {
    return fillDTO(OfferListItemRdo, {
      ...offer.toObject(),
      id: offer.id,
      isFavorite,
    });
  }

  public async getList(_req: Request, res: Response): Promise<void> {
    const userId = this.getUserId(res);
    const favorites = await this.favoriteService.findByUserId(userId);
    const offers = favorites
      .map((favorite) => favorite.offerId)
      .filter(isDocument)
      .map((offer) => this.toOfferListItemRdo(offer, true));

    this.ok(res, offers);
  }

  public async add(req: Request, res: Response): Promise<void> {
    const userId = this.getUserId(res);
    const offerId = String(req.params.offerId);
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw this.createOfferNotFoundError(offerId);
    }

    await this.favoriteService.add({ userId, offerId });
    this.ok(res, this.toOfferListItemRdo(offer, true));
  }

  public async remove(req: Request, res: Response): Promise<void> {
    const userId = this.getUserId(res);
    const offerId = String(req.params.offerId);
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw this.createOfferNotFoundError(offerId);
    }

    const favorite = await this.favoriteService.remove({ userId, offerId });

    if (!favorite) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ID ${offerId} is not in favorites.`,
        'FavoriteController',
      );
    }

    this.ok(res, this.toOfferListItemRdo(offer, false));
  }
}
