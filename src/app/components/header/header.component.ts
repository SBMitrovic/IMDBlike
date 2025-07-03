import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Genre } from 'src/app/interfaces/genre';
import { GenresService } from 'src/app/services/genres.service';
import { MoviesapiService } from 'src/app/services/moviesapi.service';
import { GenreComponent } from '../genres/genre.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = 'IMDBLike';
  searchBarUp: any;
  leftSidebar: any;
  genresArr: Genre[] = [];
  moviesArr: any;
  public genreComponent : GenreComponent;

  // Authentication properties
  currentUser: any = null;
  private authSubscription: Subscription = new Subscription();
  
  // Search properties
  searchQuery: string = '';


  constructor(private genreService: GenresService, private moviesService: MoviesapiService,private router : ActivatedRoute,
    private route : Router, private sanitizer : DomSanitizer, private renderer: Renderer2, private authService: FirebaseAuthService, private dialog: MatDialog) {
      this.genreComponent = new GenreComponent(this.genreService, this.moviesService, this.router, this.sanitizer, this.route, this.dialog);
    }

  ngOnInit() {
    this.getGenres();
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    
    // Subscribe to authentication state
    this.authSubscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  // Add logout method
  async logout(): Promise<void> {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Search functionality
  onSearch() {
    if (this.searchQuery && this.searchQuery.trim()) {
      this.route.navigate(['/movies/search'], { 
        queryParams: { q: this.searchQuery.trim() } 
      });
    }
  }

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.searchQuery && this.searchQuery.trim()) {
      this.onSearch();
    }
  }
 
  getGenres() {
    this.genreService.getAllGenres().subscribe(res => this.genresArr = res.genres);
  }
  
  
         classToggle() {
        
           const navs = document.querySelectorAll('.Navbar__Items')
          navs.forEach(nav => nav.classList.toggle('Navbar__ToggleShow'));
         //this.renderer.addClass(this.selector.nativeElement, 'active');
         //JS
        //document.querySelector('.Navbar__Link-toggle')
          //.addEventListener('click', classToggle);
        }
 
}