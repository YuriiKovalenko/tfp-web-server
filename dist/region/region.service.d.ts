import { HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class RegionService {
    private http;
    private readonly countryApiUrl;
    private readonly cityApiUrl;
    private cache;
    constructor(http: HttpService);
    private getCache;
    private getCountryListCached;
    private getCountryListApi;
    private getCountryList;
    private getCountryCodeByName;
    private getCitiesByCountryCodeAndText;
    getCountryByText(text: string): Observable<{
        name: string;
        nativeName: string;
        flag: string;
    }[]>;
    getCityByTextAndCountryName(text: string, country: string): Observable<{
        toponymName: string;
        name: string;
    }[]>;
}
