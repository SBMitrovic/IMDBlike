import { Component, OnInit, Inject, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from 'src/app/interfaces/movie';
import { MoviesapiService } from 'src/app/services/moviesapi.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserListsService } from 'src/app/services/user-lists.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit{
  public id : any; 
  public video : any;
  movie : Movie | undefined;
  isModalMode = false;

  baseUrl = 'https://www.youtube.com/embed/';
  autoplay = '?rel=0;&autoplay=1&mute=0';
  relatedvideo: any;
  casts: any = [];
  backdrops: any = [];
  recomendMovies: any = [];
//  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];
  

  
  constructor(
    private router : Router, 
    private movieService : MoviesapiService, 
    private route :ActivatedRoute,
    private sanitizer: DomSanitizer, 
    private dialog: MatDialog,
    private userListsService: UserListsService,
    private authService: FirebaseAuthService,
    private snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() public dialogRef: MatDialogRef<MovieDetailsComponent>
  ) {}
  ngOnInit(): void {
    // Scroll to top when component initializes
    window.scrollTo(0, 0);
    
    // Check if opened as modal or route
    if (this.data && this.data.movieId) {
      // Modal mode
      this.isModalMode = true;
      this.id = this.data.movieId;
      this.movie = this.data.movie; // Use the passed movie data initially
      this.getSingleMovieDetails(this.id);
      this.getSingleMovieVideos(this.id);
      this.getCast(this.id);
      this.getBackropsImages(this.id);
      this.getRecomendMovie(this.id);
    } else {
      // Route mode
      this.isModalMode = false;
      this.route.params.subscribe(params => {
        this.id = params['id'];
        // Scroll to top when route params change (navigating between different movies)
        window.scrollTo(0, 0);
        this.getSingleMovieDetails(this.id);
        this.getSingleMovieVideos(this.id);
        this.getCast(this.id);
        this.getBackropsImages(this.id);
        this.getRecomendMovie(this.id);
      });
    }
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
    if (video && video.key) {
      // Open YouTube video in a new tab
      const youtubeUrl = `https://www.youtube.com/watch?v=${video.key}`;
      window.open(youtubeUrl, '_blank');
    }
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

  openMovieModal(movie: any): void {
    if (this.isModalMode) {
      // If we're in modal mode, close current modal and navigate to movie details page
      this.dialogRef?.close();
      this.router.navigate(['/movies', movie.id]).then(() => {
        window.scrollTo(0, 0);
      });
    } else {
      // If we're on the page, just navigate to the new movie
      this.router.navigate(['/movies', movie.id]).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  openPersonDetails(personId: number): void {
    this.router.navigate(['/person', personId]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  // User lists functionality
  isInFavorites(movieId: number): boolean {
    return this.userListsService.isInFavorites(movieId);
  }

  isInWatchLater(movieId: number): boolean {
    return this.userListsService.isInWatchLater(movieId);
  }

  toggleFavorite(movie: Movie, event: Event): void {
    event.stopPropagation();
    
    if (!this.authService.isAuthenticated()) {
      this.showLoginRequiredMessage('favorites');
      return;
    }
    
    this.userListsService.toggleFavorite(movie);
  }

  toggleWatchLater(movie: Movie, event: Event): void {
    event.stopPropagation();
    
    if (!this.authService.isAuthenticated()) {
      this.showLoginRequiredMessage('watchlist');
      return;
    }
    
    this.userListsService.toggleWatchLater(movie);
  }

  private showLoginRequiredMessage(feature: string): void {
    const message = `Please log in to add movies to your ${feature} ✨`;
    const snackBarRef = this.snackBar.open(message, 'Login Now', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'login-required-snackbar'
    });

    snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
