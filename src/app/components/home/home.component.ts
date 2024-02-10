import { Component } from '@angular/core';
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
    constructor(private movieService : MoviesapiService) {
      this.moviesArr = [];
    }

    ngOnInit(): void {
        this.moviesArr = this.movieService.getUpcoingMovies(5).subscribe(res => this.moviesArr = res.results);
        console.log(this.moviesArr);
    }

    openModal() {
      this.display = "block";
    }
    onCloseHandled() {
      this.display = "none";
    }
    
    images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
}
