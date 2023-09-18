import { Component } from '@angular/core';
import { MoviesapiService } from './services/moviesapi.service';
import { Genre } from '../interfaces/genre';
import { Genres } from '../interfaces/genres';
import { Observable, from } from 'rxjs';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.sass']
})
export class MoviesComponent {
  usersArr: User[] = [];
  genresArr : Genre[] = [];

  genres  : Observable<Genres> | undefined;
  users : Observable<User[]>;

  constructor(moviesService: MoviesapiService) {
    this.users = moviesService.getUsers();
    this.users.subscribe(val => this.usersArr = val);
    this.users.subscribe(val => console.log(val));
    console.log('Type of this.users: ' + typeof this.users);

    this.genres = moviesService.getGenres();
    this.genres.subscribe(res => this.genresArr = res.genres);
    this.genres.subscribe(val => console.log(val.genres));
    console.log('Type of this.genres: ' + typeof this.users);
    
  }
    logGenres(){
      for(let genre of this.genresArr){
        console.log('Genres' + genre.id);
      }
    }

    // log users
    logUsers(){
      for(let user of this.usersArr){
        console.log('User' + user.name);
      }
    }
}


