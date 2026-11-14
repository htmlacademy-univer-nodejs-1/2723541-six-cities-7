import {
  defaultClasses,
  getModelForClass,
  index,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface FavoriteEntity extends defaultClasses.Base {}

@index({ userId: 1, offerId: 1 }, { unique: true })
@modelOptions({ schemaOptions: { collection: 'favorites' } })
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class FavoriteEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    ref: () => UserEntity,
  })
  public userId: Ref<UserEntity>;

  @prop({
    required: true,
    ref: () => OfferEntity,
  })
  public offerId: Ref<OfferEntity>;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
