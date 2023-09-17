import { Component } from '@angular/core';
import { MoviesapiService } from './services/moviesapi.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.sass']
})
export class MoviesComponent {
  movies;

  constructor(service: MoviesapiService) {
    this.movies = service.getMovies();
    
  }

}
