import { Component, OnInit } from '@angular/core';
import { Genre } from './interfaces/genre';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { GenresService } from './services/genres.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit{
  
  genresArr : Genre[] = [];
  selectedGenreIds: string[] | undefined;
  loading = true;
  color: ThemePalette = 'warn';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;


  constructor(private genreService : GenresService, private router : Router){
    
    
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd) {
        setTimeout (() => {
          this.loading = false;
       }, 1000);
      }
    });
    
  }
  ngOnInit(){

  }



}
