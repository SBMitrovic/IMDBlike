import { Component, ViewChild } from '@angular/core';
import { MoviesapiService } from 'src/app/services/moviesapi.service';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  moviesArr : any;
  display = "none";
  images = [];
  active_movie_id : number | undefined;

//  @ViewChild('currentMovieOnCarousel') currentMovieOnCarousel: NgbCarouselModule ;

    constructor(protected movieService : MoviesapiService) {
      this.moviesArr = [];
     
    }

    ngOnInit(): void {
        this.moviesArr = this.movieService.getTopRatedMovies(1).subscribe(res => this.moviesArr = res.results);
        console.log(this.moviesArr);
        
        }
    

    openModal() {
      this.display = "block";
    }
    onCloseHandled() {
      this.display = "none";
    }

    getMovieVideo(id : string){
      this.movieService.getMovieVideos(id);
    }

    getActiveMovieId(){

    }
    setActiveMovieId(id: any){
      console.log("Setting movie_id for" + id);
      this.active_movie_id = id;

      console.log("Currently active movie id is " ,this.active_movie_id);
    }




}