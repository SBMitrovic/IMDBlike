import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Movie, Movies } from 'src/app/interfaces/movie';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})


export class MoviesapiService {

  private readonly proxyUrl = '/.netlify/functions/tmdb';
  
  pageNum = 1;
  topRatedMoviesArr : Movie [] = [];
  smh : Movie [] = [];
  language = 'en-US';
  region = 'US';

  constructor(private httpClient: HttpClient) {}

  // Proxy metoda - svi TMDB zahtjevi idu kroz ovu funkciju
  private callProxy(endpoint: string, params: Record<string, any> = {}): Observable<any> {
    return this.httpClient.post<any>(this.proxyUrl, { endpoint, params });
  }
 

  getTopRatedMovies(page : number): Observable<Movies> {
    return this.callProxy('/movie/top_rated', { 
      page, 
      language: this.language 
    });
  }

  getNowPlaying(page: number): Observable<any> {
    return this.callProxy('/movie/now_playing', { 
      page, 
      language: this.language, 
      region: this.region 
    });
  }

  searchMovies(searchStr: string, page: number = 1): Observable<any> {
    return this.callProxy('/search/movie', { 
      query: searchStr, 
      page 
    });
  }

  getMovie(id: string): Observable<any> {
    return this.callProxy(`/movie/${id}`, {});
  }
  
  getMoviesByGenre(id: string | undefined, page: number = 1): Observable<Movies> {
    return this.callProxy('/discover/movie', { 
      with_genres: id, 
      page 
    });
  }

  getMovieReviews(id: string): Observable<any> {
    return this.callProxy(`/movie/${id}/reviews`, {});
  }

  getMovieCredits(id: string): Observable<any> {
    return this.callProxy(`/movie/${id}/credits`, {});
  }

  getBackdropsImages(id: string): Observable<any> {
    return this.callProxy(`/movie/${id}/images`, {});
  }

  getMovieVideos(id: string): Observable<any> {
    return this.callProxy(`/movie/${id}/videos`, { 
      language: this.language 
    });
  }

  getRecomendMovies(id: string): Observable<any> {
    return this.callProxy(`/movie/${id}/recommendations`, {});
  }

  getPersonDetail(id: string): Observable<any> {
    return this.callProxy(`/person/${id}`, {});
  }

  getPersonExternalData(id: string): Observable<any> {
    return this.callProxy(`/person/${id}/external_ids`, {});
  }

  getPersonCast(id: string): Observable<any> {
    return this.callProxy(`/person/${id}/movie_credits`, {});
  }

  getUpcoingMovies(page : number): Observable<any> {
    return this.callProxy('/movie/upcoming', { 
      language: this.language, 
      page 
    });
  }

}
