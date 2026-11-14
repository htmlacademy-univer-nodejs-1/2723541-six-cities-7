import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import {
  Amenity,
  City,
  CityName,
  HousingType,
  Location,
} from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';
import { DEFAULT_RATING } from './offer.constant.js';

@modelOptions({ schemaOptions: { _id: false } })
class LocationEntity implements Location {
  @prop({ required: true })
  public latitude: number;

  @prop({ required: true })
  public longitude: number;
}

@modelOptions({ schemaOptions: { _id: false } })
class CityEntity implements City {
  @prop({
    required: true,
    type: () => String,
    enum: CityName,
  })
  public name: CityName;

  @prop({
    required: true,
    type: () => LocationEntity,
  })
  public location: LocationEntity;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({ schemaOptions: { collection: 'offers' } })
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 100,
  })
  public title: string;

  @prop({
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 1024,
  })
  public description: string;

  @prop({ required: true })
  public postDate: Date;

  @prop({
    required: true,
    type: () => CityEntity,
  })
  public city: CityEntity;

  @prop({ required: true })
  public previewImage: string;

  @prop({
    required: true,
    type: () => [String],
    validate: {
      validator: (images: string[]) => images.length === 6,
      message: 'The offer must contain exactly six images',
    },
  })
  public images: string[];

  @prop({ required: true })
  public isPremium: boolean;

  @prop({
    required: true,
    default: DEFAULT_RATING,
    min: 1,
    max: 5,
  })
  public rating: number;

  @prop({
    required: true,
    type: () => String,
    enum: HousingType,
  })
  public housingType: HousingType;

  @prop({
    required: true,
    min: 1,
    max: 8,
  })
  public roomsCount: number;

  @prop({
    required: true,
    min: 1,
    max: 10,
  })
  public guestsCount: number;

  @prop({
    required: true,
    min: 100,
    max: 100000,
  })
  public price: number;

  @prop({
    required: true,
    type: () => [String],
    enum: Amenity,
    validate: {
      validator: (amenities: Amenity[]) => amenities.length > 0,
      message: 'The offer must contain at least one amenity',
    },
  })
  public amenities: Amenity[];

  @prop({
    required: true,
    ref: () => UserEntity,
  })
  public author: Ref<UserEntity>;

  @prop({
    required: true,
    default: 0,
    min: 0,
  })
  public commentCount: number;

  @prop({
    required: true,
    type: () => LocationEntity,
  })
  public location: LocationEntity;
}

export const OfferModel = getModelForClass(OfferEntity);
