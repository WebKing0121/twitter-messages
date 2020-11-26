
export interface IUSer {
  id: number;
  name: string;
  location: string;
  created_at: string;
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  profile_image_url: string;
  profile_image_url_https: string;
  screen_name: string;
}

export interface IPlace {
  id: string;
  country: string;
  country_code: string;
  full_name: string;
  name: string;
  place_type: string;
  url: string;
}

export interface IHashtag {
  text: string;
  indices: number[];
}
