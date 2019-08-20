import { Injectable, HttpService } from '@nestjs/common';
import { map, switchMap, pluck, flatMap } from 'rxjs/operators';
import { Country, City } from './region.model';
import { of, Observable } from 'rxjs';

interface Cache {
  countries?: Country[];
}

@Injectable()
export class RegionService {
  private readonly countryApiUrl: string;
  private readonly cityApiUrl: string;
  private cache: Cache;

  constructor(private http: HttpService) {
    this.countryApiUrl = 'https://restcountries.eu/rest/v2';
    this.cityApiUrl =
      'http://api.geonames.org/search?username=schrbkw&type=json&cities=cities1000';
    this.cache = {};
  }

  private getCache() {
    return of(this.cache);
  }

  private getCountryListCached() {
    return this.getCache().pipe(pluck('countries'));
  }

  private getCountryListApi() {
    return this.http
      .get<Country[]>(
        `${this.countryApiUrl}/all?fields=name;nativeName;altSpellings;flag;alpha2Code`,
      )
      .pipe(map(result => (this.cache.countries = result.data)));
  }

  private getCountryList(): Observable<Country[]> {
    return this.getCountryListCached().pipe(
      flatMap(cachedCountries =>
        cachedCountries ? of(cachedCountries) : this.getCountryListApi(),
      ),
    );
  }

  private getCountryCodeByName(name: string) {
    return this.getCountryList().pipe(
      map(
        countries =>
          countries.find(
            country => country.name.toLowerCase() === name.toLowerCase(),
          ).alpha2Code,
      ),
    );
  }

  private getCitiesByCountryCodeAndText(code: string, text: string) {
    return this.http.get<{ geonames: City[] }>(
      `${this.cityApiUrl}&country=${code}&name_startsWith=${encodeURIComponent(
        text,
      )}`,
    );
  }

  public getCountryByText(text: string) {
    const test = text.toLowerCase();
    const testCountries = (country: Country) =>
      country.name.toLowerCase().includes(test) ||
      country.nativeName.toLowerCase().includes(test) ||
      country.altSpellings.some(sp => sp.toLowerCase().includes(test));
    const mapCountries = ({ name, nativeName, flag }: Country): Country => ({
      name,
      nativeName,
      flag,
    });
    return this.getCountryList().pipe(
      map(countries =>
        countries
          .filter(testCountries)
          .slice(0, 6)
          .map(mapCountries),
      ),
    );
  }

  public getCityByTextAndCountryName(text: string, country: string) {
    const mapCities = ({ toponymName, name }: City): City => ({
      toponymName,
      name,
    });
    return this.getCountryCodeByName(country).pipe(
      switchMap(code => this.getCitiesByCountryCodeAndText(code, text)),
      map(result => result.data.geonames.slice(0, 6).map(mapCities)),
    );
  }
}
