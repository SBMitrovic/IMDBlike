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
  genresArr: Genre[] = [];
  moviesArr: any;
  public currentId: any;
  public urlArr: any;

  constructor(
    genresService: GenresService, 
    private moviesService: MoviesapiService, 
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer, 
    private route: Router
  ) {
    genresService.getAllGenres().subscribe(res => this.genresArr = res.genres);
  }

  ngOnInit() {
    // Call searchByGenre without parameters, which will handle URL extraction
    this.searchByGenre();
    console.log("I'm called");
  }

  onGenreChange(event: Event) {
    const selectedGenreId = (event.target as HTMLSelectElement).value;
    if (selectedGenreId) {
      this.searchByGenre(selectedGenreId);  // Pass the selected genre ID to searchByGenre
    }
  }

  searchByGenre(id?: string) {
    console.clear();
    console.log(("ID: " + id));
    // If no ID is passed, extract from the URL
    if (!id) {
      console.log("No ID passed");
      this.router.params.subscribe((params: Params) => {
        id = params['id'];  // Extract the genre ID from the URL
        console.log('Extracted genre ID from URL: ', id);

        // Fetch the movies for the selected genre
        this.moviesArr = [];
        this.moviesService.getMoviesByGenre(id).subscribe(res => {
          this.moviesArr = res.results;
        });

        // Navigate to the route with the genre ID
        this.route.navigate(['/genres/', id]);
      });
    } else {
      console.log("ID passed");
      // Fetch the movies immediately if an ID is passed
      this.moviesArr = [];
      this.moviesService.getMoviesByGenre(id).subscribe(res => {
        this.moviesArr = res.results;
      });

      // Navigate to the genre route with the provided ID
      this.route.navigate(['/genres/', id]);
    }
  }
}