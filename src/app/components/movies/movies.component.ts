import { Component, OnInit } from '@angular/core';
import { MoviesapiService } from '../../services/moviesapi.service';

import { Observable, delay, from } from 'rxjs';

import { GenresService } from '../../services/genres.service';
import { Genre } from 'src/app/interfaces/genre';
import { Movie } from 'src/app/interfaces/movie';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})

export class MoviesComponent implements OnInit {
  genresArr : Genre[] = [];
  moviesArr : Movie[] = [];
  totalResults: any;
  loader = true;
  searchString : any;
  searchResults: Movie[] = []; 

  constructor(private moviesService: MoviesapiService,private genresService : GenresService) {}
    
  ngOnInit(){
   this.getTopratedMovies(1);
   console.log(("MoviesArr:"));	
   console.log((this.moviesArr));
  }


  getTopratedMovies(page : number) {
    this.moviesService.getTopRatedMovies(page).pipe(delay(1000)).subscribe(res => {
      this.moviesArr = res.results,
      console.log(res.results);
      this.totalResults = res.total_results;
      this.loader = false;
    });
  }

  searchMovies(){
    this.moviesService.searchMovies(this.searchString).subscribe(res => {
      this.searchResults = res.results;
    })
  }
  
}


