import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Genre } from 'src/app/interfaces/genre';
import { User } from 'src/app/interfaces/user';
import { Genres } from 'src/app/interfaces/genres';
import { Movie, Movies } from 'src/app/interfaces/movie';


@Injectable({
  providedIn: 'root'
})

@Injectable({providedIn: 'root'})
export class MoviesapiService {
  private readonly rootUrl = 'https://api.themoviedb.org/3/movie';
  private readonly apiKey = 'f300e933685acb83d84aa24df1bb7170';

  
  

  constructor(private httpClient: HttpClient) {}

  getAllMovies(): Observable<Movies> {
    return new Observable<Movies>;
  }

  getTopRatedMovies(): Observable<Movies> {
    const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMzAwZTkzMzY4NWFjYjgzZDg0YWEyNGRmMWJiNzE3MCIsInN1YiI6IjY1MDc2NmY1MzczYWMyMDBhY2Q3MDFmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EDoLzgqvWQJa4LtkwNxYlXXSqoZFeYMv4vjJcGuZX5Q'}
    let page = '?1';
    return this.httpClient.get<Movies>(this.rootUrl + '/top_rated' + page, {headers: headers});
  }
  
}
