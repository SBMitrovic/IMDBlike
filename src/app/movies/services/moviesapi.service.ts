import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoviesapiService {
  movies = ["movie1", "movie2", "movie3"];
  constructor() { }

  getMovies() {
    return this.movies;
  }
}
