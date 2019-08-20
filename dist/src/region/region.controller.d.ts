import { RegionService } from './region.service';
import { Observable } from 'rxjs';
import { Country, City } from './region.model';
export declare class RegionController {
    private region;
    constructor(region: RegionService);
    getContriesByInput(input: string): Observable<Country[]>;
    getCitiesByInput(input: string, country: string): Observable<City[]>;
}
