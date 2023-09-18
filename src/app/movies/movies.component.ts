import { Component } from '@angular/core';
import { MoviesapiService } from './services/moviesapi.service';
import { Genre } from '../interfaces/genre';
import { Genres } from '../interfaces/genres';
import { Observable, from } from 'rxjs';
import { User } from '../interfaces/user';
import { GenresService } from './services/genres.service';
import { Movie, Movies } from '../interfaces/movie';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.sass']
})

export class MoviesComponent {
  usersArr: User[] = [];
  genresArr : Genre[] = [];
  moviesArr : Movie[] = [];

  genres  : Observable<Genres>;
  movies : Observable<Movies>;
//  users : Observable<User[]>;

  constructor(moviesService: MoviesapiService, genresService : GenresService) {
  /*
    this.users = moviesService.getUsers();
    this.users.subscribe(val => this.usersArr = val);
    this.users.subscribe(val => console.log(val));
    console.log('Type of this.users: ' + typeof this.users);
*/
    this.genres = genresService.getAllGenres();
    this.genres.subscribe(val => this.genresArr = val.genres);
    
    this.movies = moviesService.getTopRatedMovies();
    this.movies.subscribe(val => this.moviesArr = val.results);
    //console.log(this.moviesArr[0].title);
    this.movies.subscribe(val => console.log(val));
  }
}


