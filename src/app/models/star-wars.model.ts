export interface StarWarsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StarWarItems[];
}
export interface StarWarItems {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface StarWarsTable {
  name: string;
  height: string;
  birth_year: string;
}
