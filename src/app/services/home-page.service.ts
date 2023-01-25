import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StarWarsApiResponse } from '../models/star-wars.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  rootApi = 'https://swapi.dev/api/people';
  constructor(private readonly http: HttpClient) {}

  getStarWarList(searchText?: string): Observable<StarWarsApiResponse> {
    let query = '';
    if (searchText) {
      query = query + '/?search=' + searchText;
    }
    return this.http.get<StarWarsApiResponse>(this.rootApi + query);
  }
}
