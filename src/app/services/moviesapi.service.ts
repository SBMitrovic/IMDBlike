import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Movie, Movies } from 'src/app/interfaces/movie';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})


export class MoviesapiService {

  private readonly rootUrl = 'https://api.themoviedb.org/3/';
  private readonly apiKey = environment.tmdb.apiKey;
  private readonly bearerToken =  { 'Authorization': environment.tmdb.bearerToken };
  
  pageNum = 1;
  topRatedMoviesArr : Movie [] = [];
  smh : Movie [] = [];
  language = 'en-US';
  region = 'US';

  constructor(private httpClient: HttpClient) {}
 

  getTopRatedMovies(page : number): Observable<Movies> {
    return this.httpClient.get<Movies>(`${this.rootUrl}/movie/top_rated?page=${page}&language=${this.language}`, {headers: this.bearerToken});
  }

  getNowPlaying(page: number): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.get(`${this.rootUrl}/now_playing?api_key=${this.apiKey}&page=${page}&language=${this.language}&region=${this.region}`);
  }

 

  searchMovies(searchStr: string, page: number = 1): Observable<any> {
    return this.httpClient.get(`${this.rootUrl}search/movie?query=${searchStr}&page=${page}`, {headers: this.bearerToken, });
  }

  getMovie(id: string): Observable<any> {
    return this.httpClient.get(`${this.rootUrl}movie/${id}`, {headers : this.bearerToken});
  }
  
  getMoviesByGenre(id: string | undefined, page: number = 1): Observable<Movies> {
    return this.httpClient.get<Movies>(`${this.rootUrl}discover/movie?with_genres=${id}&page=${page}`, {headers : this.bearerToken});
  }

 

  getMovieReviews(id: string): Observable<any> {
    return this.httpClient.get(`${this.rootUrl}movie/${id}/reviews?api_key=${this.apiKey}`);
  }

  getMovieCredits(id: string): Observable<any> {
    return this.httpClient.get(`${this.rootUrl}movie/${id}/credits?api_key=${this.apiKey}`);
  }

  getBackdropsImages(id: string)  {
    return this.httpClient.get(`${this.rootUrl}movie/${id}/images?api_key=${this.apiKey}`);
  }

  getMovieVideos(id: string): Observable<any> {
    return this.httpClient.get(`${this.rootUrl}movie/${id}/videos?language=${this.language}`, {headers: this.bearerToken});
  }

  getRecomendMovies(id: string): Observable<any> {
    return this.httpClient.get(`${this.rootUrl}movie/${id}/recommendations?api_key=${this.apiKey}`);
  }

  getPersonDetail(id: string): Observable<any> {
    return this.httpClient.get(`${this.rootUrl}person/${id}?api_key=${this.apiKey}`);
  }

  getPersonExternalData(id: string) {
    return this.httpClient.get(`${this.rootUrl}person/${id}/external_ids?api_key=${this.apiKey}`);
  }

  getPersonCast(id: string): Observable<any> {
    return this.httpClient.get(`${this.rootUrl}person/${id}/movie_credits?api_key=${this.apiKey}`);
  }


  getUpcoingMovies(page : number) : Observable<any>{
    return this.httpClient.get(`${this.rootUrl}movie/upcoming?language=${this.language}&page=${page}`, {headers: this.bearerToken});
  }


}
