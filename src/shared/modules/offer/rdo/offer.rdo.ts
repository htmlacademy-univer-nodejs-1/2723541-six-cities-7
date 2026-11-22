import { Expose, Type } from 'class-transformer';
import type { Amenity, Location } from '../../../types/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { OfferListItemRdo } from './offer-list-item.rdo.js';

export class OfferRdo extends OfferListItemRdo {
  @Expose()
  public description: string;

  @Expose()
  public images: string[];

  @Expose()
  public roomsCount: number;

  @Expose()
  public guestsCount: number;

  @Expose()
  public amenities: Amenity[];

  @Expose()
  @Type(() => UserRdo)
  public author: UserRdo;

  @Expose()
  public location: Location;
}
