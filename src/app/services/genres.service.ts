import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre } from 'src/app/interfaces/genre';
import { Genres } from 'src/app/interfaces/genres';

@Injectable({
  providedIn: 'root'
})
export class GenresService {
  genresArr : Genre [] = [];
  private readonly proxyUrl = '/.netlify/functions/tmdb';
  
  constructor(private httpClient : HttpClient) {}

  getAllGenres(){
    // Koristi proxy umjesto direktnog TMDB API poziva
    return this.httpClient.post<Genres>(this.proxyUrl, {
      endpoint: '/genre/movie/list',
      params: {}
    });
  }

  getGenresArr(){
    this.getAllGenres().subscribe( res => this.genresArr = res.genres);
    return this.genresArr;
  }
}
