import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from 'src/app/interfaces/movie';
import { MoviesapiService } from 'src/app/services/moviesapi.service';
import { DomSanitizer } from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.sass']
})
export class MovieDetailsComponent implements OnInit{
  public id : any; 
  public video : any;
  movie : Movie | undefined;

  baseUrl = 'https://www.youtube.com/embed/';
  autoplay = '?rel=0;&autoplay=1&mute=0';
  relatedvideo: any;
  casts: any = [];
  backdrops: any = [];
  recomendMovies: any = [];
//  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];
  

  
  constructor(private router : Router, private movieService : MoviesapiService, private route :ActivatedRoute,
    private sanitizer: DomSanitizer, private dialog: MatDialog) {

   }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getSingleMovieDetails(this.id);
//      this.getSingleMovieVideos(this.id);
//      this.getCast(this.id);
//      this.getBackropsImages(this.id);
//      this.getRecomendMovie(this.id);
    })
  }
  
  
  getSingleMovieDetails(id: any) {
    this.movieService.getMovie(id).subscribe(res => {
      this.movie = res;
    })
  }

  getSingleMovieVideos(id : any) {
    this.movieService.getMovieVideos(id).subscribe((res: any) => {
      if (res.results.length) {
        this.video = res.results[0];
        this.relatedvideo = res.results;
      }
    });
  }

  openDialogMovie(video : any): void {
    this.video['url'] = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + video.key + this.autoplay); 
    /*
    this.dialog.open(AppMovieDialogComponent, {
      height: '600px',
      width: '900px',
      data: { video: this.video}
    });
    */
  }
  
  getCast(id : any) {
    this.movieService.getMovieCredits(id).subscribe((res: any) => {
      this.casts = res.cast;
    });
  }

  getBackropsImages(id : any) {
    this.movieService.getBackdropsImages(id).subscribe((res: any) => {
      this.backdrops = res.backdrops;
    });
  }

  getRecomendMovie(id : any) {
    this.movieService.getRecomendMovies(id).subscribe((res: any) => {
      this.recomendMovies = res.results;
    });
  }
}
