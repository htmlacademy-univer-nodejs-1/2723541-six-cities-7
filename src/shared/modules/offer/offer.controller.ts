import type { DocumentType } from '@typegoose/typegoose';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/index.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { CityName, Component } from '../../types/index.js';
import type { OfferService } from './offer-service.interface.js';
import type { OfferEntity } from './offer.entity.js';
import type {
  CreateOfferRequest,
  GetOffersRequest,
} from './offer-request.type.js';
import type { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferListItemRdo } from './rdo/offer-list-item.rdo.js';
import { OfferRdo } from './rdo/offer.rdo.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController...');

    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.getList });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.getById });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
  }

  private createNotFoundError(offerId: string): HttpError {
    return new HttpError(
      StatusCodes.NOT_FOUND,
      `Offer with ID ${offerId} not found.`,
      'OfferController',
    );
  }

  private toOfferRdo(offer: DocumentType<OfferEntity>): OfferRdo {
    return fillDTO(OfferRdo, {
      ...offer.toObject(),
      id: offer.id,
      isFavorite: false,
    });
  }

  private toOfferListItemRdo(offer: DocumentType<OfferEntity>): OfferListItemRdo {
    return fillDTO(OfferListItemRdo, {
      ...offer.toObject(),
      id: offer.id,
      isFavorite: false,
    });
  }

  public async getList({ query }: GetOffersRequest, res: Response): Promise<void> {
    const parsedLimit = query.limit ? Number.parseInt(query.limit, 10) : undefined;
    const limit = parsedLimit && parsedLimit > 0 ? parsedLimit : undefined;
    const offers = await this.offerService.find(limit);

    this.ok(res, offers.map((offer) => this.toOfferListItemRdo(offer)));
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.create(body);
    await offer.populate('author');

    this.created(res, this.toOfferRdo(offer));
  }

  public async getById(req: Request, res: Response): Promise<void> {
    const offerId = String(req.params.offerId);
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw this.createNotFoundError(offerId);
    }

    this.ok(res, this.toOfferRdo(offer));
  }

  public async update(req: Request, res: Response): Promise<void> {
    const offerId = String(req.params.offerId);
    const body = req.body as UpdateOfferDto;
    const offer = await this.offerService.updateById(offerId, body);

    if (!offer) {
      throw this.createNotFoundError(offerId);
    }

    this.ok(res, this.toOfferRdo(offer));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const offerId = String(req.params.offerId);
    const offer = await this.offerService.deleteById(offerId);

    if (!offer) {
      throw this.createNotFoundError(offerId);
    }

    this.noContent(res);
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const city = String(req.params.city) as CityName;
    const offers = await this.offerService.findPremium(city);
    this.ok(res, offers.map((offer) => this.toOfferListItemRdo(offer)));
  }
}
