import { Location } from './location.type.js';
import { CityName } from './city-name.enum.js';

export type City = {
  name: CityName;
  location: Location;
};
