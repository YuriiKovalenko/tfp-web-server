"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
let RegionService = class RegionService {
    constructor(http) {
        this.http = http;
        this.countryApiUrl = 'https://restcountries.eu/rest/v2';
        this.cityApiUrl =
            'http://api.geonames.org/search?username=schrbkw&type=json&cities=cities1000';
        this.cache = {};
    }
    getCache() {
        return rxjs_1.of(this.cache);
    }
    getCountryListCached() {
        return this.getCache().pipe(operators_1.pluck('countries'));
    }
    getCountryListApi() {
        return this.http
            .get(`${this.countryApiUrl}/all?fields=name;nativeName;altSpellings;flag;alpha2Code`)
            .pipe(operators_1.map(result => (this.cache.countries = result.data)));
    }
    getCountryList() {
        return this.getCountryListCached().pipe(operators_1.flatMap(cachedCountries => cachedCountries ? rxjs_1.of(cachedCountries) : this.getCountryListApi()));
    }
    getCountryCodeByName(name) {
        return this.getCountryList().pipe(operators_1.map(countries => countries.find(country => country.name.toLowerCase() === name.toLowerCase()).alpha2Code));
    }
    getCitiesByCountryCodeAndText(code, text) {
        return this.http.get(`${this.cityApiUrl}&country=${code}&name_startsWith=${encodeURIComponent(text)}`);
    }
    getCountryByText(text) {
        const test = text.toLowerCase();
        const testCountries = (country) => country.name.toLowerCase().includes(test) ||
            country.nativeName.toLowerCase().includes(test) ||
            country.altSpellings.some(sp => sp.toLowerCase().includes(test));
        const mapCountries = ({ name, nativeName, flag }) => ({
            name,
            nativeName,
            flag,
        });
        return this.getCountryList().pipe(operators_1.map(countries => countries
            .filter(testCountries)
            .slice(0, 6)
            .map(mapCountries)));
    }
    getCityByTextAndCountryName(text, country) {
        const mapCities = ({ toponymName, name }) => ({
            toponymName,
            name,
        });
        return this.getCountryCodeByName(country).pipe(operators_1.switchMap(code => this.getCitiesByCountryCodeAndText(code, text)), operators_1.map(result => result.data.geonames.slice(0, 6).map(mapCities)));
    }
};
RegionService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], RegionService);
exports.RegionService = RegionService;
//# sourceMappingURL=region.service.js.map