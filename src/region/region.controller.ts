import { Controller, Get, Query } from '@nestjs/common';
import { RegionService } from './region.service';
import { Observable } from 'rxjs';
import { Country, City } from './region.model';

@Controller('region')
export class RegionController {
  constructor(private region: RegionService) {}

  @Get('country')
  public getContriesByInput(
    @Query('input') input: string,
  ): Observable<Country[]> {
    return this.region.getCountryByText(input);
  }

  @Get('city')
  public getCitiesByInput(
    @Query('input') input: string,
    @Query('country') country: string,
  ): Observable<City[]> {
    return this.region.getCityByTextAndCountryName(input, country);
  }
}
