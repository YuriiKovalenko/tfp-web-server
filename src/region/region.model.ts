export interface Country {
  name?: string;
  nativeName?: string;
  altSpellings?: string[];
  flag?: string;
  alpha2Code?: string;
}

export interface City {
  toponymName: string;
  name: string;
}
