import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MoviesapiService } from 'src/app/services/moviesapi.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { UserListsService } from 'src/app/services/user-lists.service';
import { NgbCarousel, NgbSlideEvent, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface UserStats {
  watchedMovies: number;
  watchlistCount: number;
  reviewsCount: number;
  ratingsGiven: number;
}

interface TrendingTopic {
  title: string;
  change: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms ease-in', style({opacity: 1}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  
  // Carousel and Movies
  @ViewChild('heroCarousel', { static: false }) heroCarousel!: NgbCarousel;
  moviesArr: any[] = [];
  currentSlideIndex: number = 0;
  active_movie_id: number | undefined;
  
  // Performance optimization
  private slideChangeTimeout: any;
  
  // User Preferences
  autoplayEnabled: boolean = true;
  notificationsEnabled: boolean = false;
  showDebugInfo: boolean = false; // Set to true for development
  
  // Sidebar Data
  userStats: UserStats = {
    watchedMovies: 142,
    watchlistCount: 28,
    reviewsCount: 15,
    ratingsGiven: 89
  };
  
  trendingTopics: TrendingTopic[] = [
    { title: 'Marvel Phase 5 Updates', change: 1 },
    { title: 'Oscar 2024 Predictions', change: -1 },
    { title: 'Netflix Original Series', change: 1 },
    { title: 'Director Spotlight: Villeneuve', change: 0 },
    { title: 'Box Office Analysis', change: 1 }
  ];
  
  // Loading and Error States
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';
  
  // Subscriptions
  private subscriptions: Subscription = new Subscription();
  
  constructor(
    protected movieService: MoviesapiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: FirebaseAuthService,
    private userListsService: UserListsService
  ) {
    this.moviesArr = [];
  }

  ngOnInit(): void {
    this.loadTopRatedMovies();
    this.loadUserPreferences();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.slideChangeTimeout) {
      clearTimeout(this.slideChangeTimeout);
    }
  }

  /**
   * Load top rated movies for the carousel
   */
  loadTopRatedMovies(): void {
    this.isLoading = true;
    this.hasError = false;
    this.cdr.detectChanges();
    
    const subscription = this.movieService.getTopRatedMovies(1).subscribe({
      next: (res) => {
        this.moviesArr = res.results.slice(0,30); // Reduced to 5 movies for better performance
        if (this.moviesArr.length > 0) {
          this.active_movie_id = this.moviesArr[0].id;
          this.currentSlideIndex = 0;
        }
        this.isLoading = false;
        this.hasError = false;
        this.cdr.detectChanges();
        console.log('Loaded movies:', this.moviesArr.length, 'movies');
      },
      error: (error) => {
        console.error('Error loading movies:', error);
        this.moviesArr = [];
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Failed to load movies. Please try again later.';
        this.cdr.detectChanges();
      }
    });
    
    this.subscriptions.add(subscription);
  }
  
  /**
   * Load user preferences from localStorage or service
   */
  private loadUserPreferences(): void {
    // Load from localStorage or service
    this.autoplayEnabled = localStorage.getItem('autoplayEnabled') === 'true';
    this.notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
  }
  
  /**
   * Handle carousel slide change with debouncing for performance
   */
  onSlideChange(event: NgbSlideEvent): void {
    // Clear existing timeout to prevent multiple rapid changes
    if (this.slideChangeTimeout) {
      clearTimeout(this.slideChangeTimeout);
    }
    
    // Debounce slide change for better performance
    this.slideChangeTimeout = setTimeout(() => {
      const currentSlideId = event.current;
      const slideIndexMatch = currentSlideId.match(/ngb-slide-(\d+)/);
      
      if (slideIndexMatch) {
        const slideIndex = parseInt(slideIndexMatch[1], 10);
        
        if (slideIndex >= 0 && slideIndex < this.moviesArr.length && slideIndex !== this.currentSlideIndex) {
          this.currentSlideIndex = slideIndex;
          this.active_movie_id = this.moviesArr[slideIndex]?.id;
          this.cdr.detectChanges();
          console.log('Slide changed to:', slideIndex, 'Movie ID:', this.active_movie_id);
        }
      }
    }, 100); // 100ms debounce
  }
  
  /**
   * Navigate to previous slide
   */
  previousSlide(): void {
    if (this.heroCarousel && this.moviesArr.length > 0) {
      this.heroCarousel.prev();
    }
  }
  
  /**
   * Navigate to next slide
   */
  nextSlide(): void {
    if (this.heroCarousel && this.moviesArr.length > 0) {
      this.heroCarousel.next();
    }
  }
  
  /**
   * Go to specific slide with performance optimization
   */
  goToSlide(index: number): void {
    if (this.heroCarousel && index >= 0 && index < this.moviesArr.length && index !== this.currentSlideIndex) {
      const slideId = `ngb-slide-${index}`;
      this.heroCarousel.select(slideId);
      // Update index immediately for better UX
      this.currentSlideIndex = index;
      this.active_movie_id = this.moviesArr[index]?.id;
      this.cdr.detectChanges();
    }
  }
  
  /**
   * Handle image loading errors
   */
  onImageError(event: any): void {
    console.warn('Image failed to load:', event.target.src);
    // Set placeholder image or hide the image
    event.target.style.display = 'none';
  }
  
  /**
   * Play movie trailer
   */
  playTrailer(movieId: number): void {
    console.log('Playing trailer for movie:', movieId);
    
    // Get trailer URL from service
    const subscription = this.movieService.getMovieVideos(movieId.toString()).subscribe({
      next: (videos) => {
        const trailer = videos.results?.find((video: any) => 
          video.type === 'Trailer' && video.site === 'YouTube'
        );
        
        if (trailer) {
          // Open trailer in modal or new window
          const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
          window.open(youtubeUrl, '_blank');
        } else {
          console.log('No trailer available for this movie');
          // Show user-friendly message
        }
      },
      error: (error) => {
        console.error('Error loading trailer:', error);
      }
    });
    
    this.subscriptions.add(subscription);
  }
  
  /**
   * Navigate to movie details page
   */
  viewMovieDetails(movieId: number): void {
    this.router.navigate(['/movies', movieId]);
  }
  
  /**
   * Toggle movie in watchlist using UserListsService
   */
  toggleWatchlist(movie: any): void {
    if (!this.isUserLoggedIn()) {
      console.log('User not logged in, cannot add to watchlist');
      return;
    }

    const success = this.userListsService.toggleWatchLater(movie);
    if (success) {
      console.log('Watchlist updated for:', movie.title);
    } else {
      console.log('Failed to update watchlist');
    }
    
    this.cdr.detectChanges();
  }
  
  /**
   * Check if movie is in watchlist
   */
  isInWatchlist(movieId: number): boolean {
    return this.userListsService.isInWatchLater(movieId);
  }
  
  /**
   * Share movie
   */
  shareMovie(movie: any): void {
    const shareUrl = `${window.location.origin}/movies/${movie.id}`;
    
    if (navigator.share) {
      // Use Web Share API if available
      navigator.share({
        title: movie.title,
        text: `Check out ${movie.title} on our IMDb-like app!`,
        url: shareUrl
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        console.log('Movie URL copied to clipboard');
        // Show user feedback
      }).catch((error) => {
        console.error('Error copying to clipboard:', error);
      });
    }
  }
  
  /**
   * Check if user is logged in
   */
  isUserLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Toggle autoplay setting
   */
  toggleAutoplay(): void {
    localStorage.setItem('autoplayEnabled', this.autoplayEnabled.toString());
    console.log('Autoplay setting changed:', this.autoplayEnabled);
    
    // Apply autoplay setting to carousel immediately
    if (this.heroCarousel) {
      // Restart carousel with new interval
      this.heroCarousel.pause();
      if (this.autoplayEnabled) {
        setTimeout(() => {
          if (this.heroCarousel) {
            this.heroCarousel.cycle();
          }
        }, 100);
      }
    }
  }
  
  /**
   * TrackBy functions for *ngFor performance optimization
   */
  trackByMovieId(index: number, movie: any): number {
    return movie.id || index;
  }
  
  trackByTrendIndex(index: number, trend: any): number {
    return index;
  }
  
  trackByGenreId(index: number, genre: any): number {
    return genre.id || index;
  }

  /**
   * Legacy methods (keeping for compatibility)
   */
  getMovieVideo(id: string): void {
    this.playTrailer(parseInt(id));
  }
  
  getActiveMovieId(): number | undefined {
    return this.active_movie_id;
  }
  
  setActiveMovieId(id: any): void {
    console.log("Setting movie_id for", id);
    this.active_movie_id = id;
    console.log("Currently active movie id is", this.active_movie_id);
  }
}