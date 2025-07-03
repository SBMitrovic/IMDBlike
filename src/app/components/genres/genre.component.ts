import { Component, OnInit } from '@angular/core';
import { GenresService } from '../../services/genres.service';
import { Genre } from 'src/app/interfaces/genre';
import { MoviesapiService } from 'src/app/services/moviesapi.service';
import { Movie } from 'src/app/interfaces/movie';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit {
  genresArr: Genre[] = [];
  moviesArr: any;
  public currentId: any;
  public urlArr: any;
  
  // Pagination properties
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  loader = false;

  constructor(
    genresService: GenresService, 
    private moviesService: MoviesapiService, 
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer, 
    private route: Router,
    private dialog: MatDialog
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

  searchByGenre(id?: string, page: number = 1) {
    console.clear();
    console.log(("ID: " + id + ", Page: " + page));
    this.loader = true;
    this.currentPage = page;
    
    // If no ID is passed, extract from the URL
    if (!id) {
      console.log("No ID passed");
      this.router.params.subscribe((params: Params) => {
        id = params['id'];  // Extract the genre ID from the URL
        this.currentId = id; // Store the current ID
        console.log('Extracted genre ID from URL: ', id);

        // Fetch the movies for the selected genre
        this.moviesArr = [];
        this.moviesService.getMoviesByGenre(id, page).subscribe(res => {
          this.moviesArr = res.results;
          this.totalResults = res.total_results;
          this.totalPages = res.total_pages;
          this.loader = false;
        });

        // Navigate to the route with the genre ID
        this.route.navigate(['/genres/', id]);
      });
    } else {
      console.log("ID passed");
      this.currentId = id; // Store the current ID
      // Fetch the movies immediately if an ID is passed
      this.moviesArr = [];
      this.moviesService.getMoviesByGenre(id, page).subscribe(res => {
        this.moviesArr = res.results;
        this.totalResults = res.total_results;
        this.totalPages = res.total_pages;
        this.loader = false;
      });

      // Navigate to the genre route with the provided ID
      this.route.navigate(['/genres/', id]);
    }
  }

  getGenreName(): string {
    if (!this.currentId || !this.genresArr.length) {
      return 'Popular';
    }
    
    const genre = this.genresArr.find(g => g.id.toString() === this.currentId.toString());
    return genre ? genre.name : 'Popular';
  }

  // Pagination methods
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.searchByGenre(this.currentId, this.currentPage + 1);
      this.scrollToTop();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.searchByGenre(this.currentId, this.currentPage - 1);
      this.scrollToTop();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.searchByGenre(this.currentId, page);
      this.scrollToTop();
    }
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Helper methods for template
  get canGoToPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  get canGoToNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  // Modal functionality
  openMovieModal(movie: any) {
    // Prevent multiple modals from opening
    if (this.dialog.openDialogs.length > 0) {
      return;
    }

    console.log('Opening modal for movie:', movie.title);

    const dialogRef = this.dialog.open(MovieDetailsComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: { movieId: movie.id, movie: movie },
      panelClass: 'movie-modal-panel',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'modal-backdrop',
      autoFocus: false,
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Movie modal was closed');
      // Force change detection after modal closes
      setTimeout(() => {
        // This ensures the component is properly refreshed
      }, 100);
    });
  }
}