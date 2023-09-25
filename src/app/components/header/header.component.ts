import { Component, OnInit } from '@angular/core';
import { Genre } from 'src/app/interfaces/genre';
import { GenresService } from 'src/app/services/genres.service';
import { MoviesapiService } from 'src/app/services/moviesapi.service';
import { GenreComponent } from '../genres/genre.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title = 'IMDBLike';
  searchBarUp: any;
  leftSidebar: any;
  genresArr: Genre[] = [];
  moviesArr: any;
  public genreComponent : GenreComponent;


  constructor(private genreService: GenresService, private moviesService: MoviesapiService,private router : ActivatedRoute,
    private route : Router, private sanitizer : DomSanitizer) {
      this.genreComponent = new GenreComponent(this.genreService, this.moviesService, this.router, this.sanitizer, this.route);
    }

  ngOnInit() {
    this.getGenres();
  }

  searchByGenre(id: any) {
    this.moviesService.getMoviesByGenre(id).subscribe(res  => {
      this.moviesArr = res.results;
    })
  }
  getGenres() {
    this.genreService.getAllGenres().subscribe(res => this.genresArr = res.genres);
  }
}