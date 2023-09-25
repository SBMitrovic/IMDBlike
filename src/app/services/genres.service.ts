import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre } from 'src/app/interfaces/genre';
import { Genres } from 'src/app/interfaces/genres';

@Injectable({
  providedIn: 'root'
})
export class GenresService {
  genresArr : Genre [] = [];
  private readonly rootUrl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=';
  private readonly apiKey = 'f300e933685acb83d84aa24df1bb7170';
  constructor(private httpClient : HttpClient) {}

  getAllGenres(){
    return this.httpClient.get<Genres>(this.rootUrl + this.apiKey);
  }

  getGenresArr(){
    this.getAllGenres().subscribe( res => this.genresArr = res.genres);
    return this.genresArr;
  }
}
