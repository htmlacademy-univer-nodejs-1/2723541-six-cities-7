import { Amenity, City, HousingType, Location } from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public city: City;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public housingType: HousingType;
  public roomsCount: number;
  public guestsCount: number;
  public price: number;
  public amenities: Amenity[];
  public authorId: string;
  public location: Location;
}
