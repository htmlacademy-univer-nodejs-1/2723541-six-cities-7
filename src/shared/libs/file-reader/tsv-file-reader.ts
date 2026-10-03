import { readFileSync } from 'node:fs';
import { Amenity, CityName, HousingType, Offer, UserType } from '../../types/index.js';
import { FileReader } from './index.js';


export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filePath: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filePath, { encoding: 'utf-8' });
  }

  private parseLine(line: string): Offer {
    const [
      title,
      description,
      postDate,
      cityName,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      housingType,
      roomsCount,
      guestsCount,
      price,
      amenities,
      authorName,
      authorEmail,
      authorAvatar,
      authorPassword,
      authorType,
      latitude,
      longitude
    ] = line.split('\t');

    const location = {
      latitude: Number(latitude),
      longitude: Number(longitude)
    };

    return {
      title,
      description,
      postDate: new Date(postDate),

      city: {
        name: cityName as CityName,
        location
      },

      previewImage,
      images: images.split(';'),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: Number(rating),
      housingType: housingType as HousingType,
      roomsCount: Number(roomsCount),
      guestsCount: Number(guestsCount),
      price: Number(price),
      amenities: amenities.split(';') as Amenity[],

      author: {
        name: authorName,
        email: authorEmail,
        avatar: authorAvatar,
        password: authorPassword,
        type: authorType as UserType
      },

      commentCount: 0,
      location
    };
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File is not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLine(line));
  }
}
