import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre } from 'src/app/interfaces/genre';
import { Genres } from 'src/app/interfaces/genres';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenresService {
  genresArr : Genre [] = [];
  private readonly rootUrl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=';
  private readonly apiKey = environment.tmdb.apiKey;
  constructor(private httpClient : HttpClient) {}

  getAllGenres(){
    return this.httpClient.get<Genres>(this.rootUrl + this.apiKey);
  }

  getGenresArr(){
    this.getAllGenres().subscribe( res => this.genresArr = res.genres);
    return this.genresArr;
  }
}
