import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MoviesapiService } from '../../services/moviesapi.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, delay, from, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { GenresService } from '../../services/genres.service';
import { Genre } from 'src/app/interfaces/genre';
import { Movie } from 'src/app/interfaces/movie';
import { FormControl } from '@angular/forms';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';


@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})

export class MoviesComponent implements OnInit, OnDestroy {
  genresArr : Genre[] = [];
  moviesArr : Movie[] = [];
  totalResults: any;
  loader = true;
  searchString : any;
  searchResults: Movie[] = [];
  
  // Pagination properties
  currentPage = 1;
  totalPages = 1;
  resultsPerPage = 20; // TMDb API returns 20 results per page by default
  
  // Search properties
  isSearchMode = false;
  searchQuery = '';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private moviesService: MoviesapiService,
    private genresService : GenresService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}
    
  ngOnInit(){
    // Check if this is a search route
    this.activatedRoute.queryParams.subscribe(params => {
      const searchQuery = params['q'];
      if (searchQuery) {
        this.isSearchMode = true;
        this.searchQuery = searchQuery;
        this.searchMoviesByQuery(searchQuery, 1);
      } else {
        this.isSearchMode = false;
        this.getTopratedMovies(1);
      }
    });
    
    console.log(("MoviesArr:"));	
    console.log((this.moviesArr));
  }


  getTopratedMovies(page : number) {
    this.loader = true;
    this.currentPage = page;
    this.moviesService.getTopRatedMovies(page).pipe(delay(1000)).subscribe(res => {
      this.moviesArr = res.results,
      console.log(res.results);
      this.totalResults = res.total_results;
      this.totalPages = res.total_pages;
      this.loader = false;
    });
  }

  searchMovies(){
    this.moviesService.searchMovies(this.searchString).subscribe(res => {
      this.searchResults = res.results;
    })
  }

  // Search functionality with pagination
  searchMoviesByQuery(query: string, page: number) {
    this.loader = true;
    this.currentPage = page;
    this.searchQuery = query;
    this.moviesService.searchMovies(query, page).subscribe(res => {
      this.moviesArr = res.results;
      this.totalResults = res.total_results;
      this.totalPages = res.total_pages;
      this.loader = false;
    });
  }

  // Pagination methods
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      if (this.isSearchMode) {
        this.searchMoviesByQuery(this.searchQuery, this.currentPage + 1);
      } else {
        this.getTopratedMovies(this.currentPage + 1);
      }
      this.scrollToTop();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      if (this.isSearchMode) {
        this.searchMoviesByQuery(this.searchQuery, this.currentPage - 1);
      } else {
        this.getTopratedMovies(this.currentPage - 1);
      }
      this.scrollToTop();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      if (this.isSearchMode) {
        this.searchMoviesByQuery(this.searchQuery, page);
      } else {
        this.getTopratedMovies(page);
      }
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
  openMovieModal(movie: Movie) {
    // Prevent multiple modals from opening
    if (this.dialog.openDialogs.length > 0) {
      console.log('Modal already open, preventing duplicate');
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

    const subscription = dialogRef.afterClosed().subscribe(result => {
      console.log('Movie modal was closed');
      // Force change detection after modal closes
      setTimeout(() => {
        this.cdr.detectChanges();
        console.log('Change detection triggered after modal close');
      }, 100);
      subscription.unsubscribe();
    });

    this.subscriptions.add(subscription);
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Debugging and tracking functions
  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }

  onCardHover(movie: Movie): void {
    console.log('Card hover detected for:', movie.title);
  }

}


