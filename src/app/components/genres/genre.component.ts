import { Component, OnInit } from '@angular/core';
import { GenresService } from '../../services/genres.service';
import { Genre } from 'src/app/interfaces/genre';
import { MoviesapiService } from 'src/app/services/moviesapi.service';
import { Movie } from 'src/app/interfaces/movie';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.sass']
})
export class GenreComponent implements OnInit {
  genresArr : Genre[] = [];
  moviesArr: any
  public currentId : any;
  public urlArr : any;

  ngOnInit  () {
      this.urlArr = this.route.url.split('/');
      this.searchByGenre(this.urlArr[2]);
      console.log('Na ng initu : ' + this.urlArr);
//      this.route.routeReuseStrategy.shouldReuseRoute = () => false;
//      this.getSingleMovieVideos(this.id);
//      this.getCast(this.id);
//      this.getBackropsImages(this.id);
//      this.getRecomendMovie(this.id);
  }

 

 

  constructor(genresService : GenresService,private moviesService : MoviesapiService, private router :ActivatedRoute,
    private sanitizer: DomSanitizer,private route : Router) {
    genresService.getAllGenres().subscribe(res => this.genresArr = res.genres);
    this.urlArr = this.route.url.split('/');
    this.searchByGenre(this.urlArr[2]);
    
  } 


    searchByGenre(id : string, event? : Event) {
    this.moviesArr = [] ;
    this.moviesService.getMoviesByGenre(id).subscribe(res => {
      this.moviesArr = res.results;  
      
    })
    console.log("Currently in SEARCHBYGENRE ----------------" + this.moviesArr[0]);
    console.log("Currently in SEARCHBYGENRE ----------------" + id);
    
  }
  
  

}
