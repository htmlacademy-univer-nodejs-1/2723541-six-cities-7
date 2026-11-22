import type { Request } from 'express';
import type { RequestBody, RequestParams } from '../../libs/rest/index.js';
import type { CreateOfferDto } from './dto/create-offer.dto.js';

type OfferQuery = {
  limit?: string;
};

export type GetOffersRequest = Request<RequestParams, RequestBody, RequestBody, OfferQuery>;
export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDto>;
