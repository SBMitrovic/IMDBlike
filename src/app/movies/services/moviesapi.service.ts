import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Genre } from 'src/app/interfaces/genre';
import { User } from 'src/app/interfaces/user';
import { Genres } from 'src/app/interfaces/genres';


@Injectable({
  providedIn: 'root'
})

@Injectable({providedIn: 'root'})
export class MoviesapiService {
 
  movies = ["movie1", "movie2", "movie3"];
  readonly rootUrl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=';
  private readonly api_key = 'f300e933685acb83d84aa24df1bb7170';
  JSONplaceholder = 'https://jsonplaceholder.typicode.com/users';

  

  constructor(private httpClient : HttpClient) {}

  getGenres(): Observable<Genres>{
    console.log(this.httpClient.get<Genres>('https://api.themoviedb.org/3/genre/movie/list?api_key=f300e933685acb83d84aa24df1bb7170'));
    return this.httpClient.get<Genres>('https://api.themoviedb.org/3/genre/movie/list?api_key=f300e933685acb83d84aa24df1bb7170');
  }

  getUsers(): Observable<User[]>{
    return this.httpClient.get<User[]>(this.JSONplaceholder);
  }

}
