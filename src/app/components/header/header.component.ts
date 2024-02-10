import { Component, OnInit, Renderer2 } from '@angular/core';
import { Genre } from 'src/app/interfaces/genre';
import { GenresService } from 'src/app/services/genres.service';
import { MoviesapiService } from 'src/app/services/moviesapi.service';
import { GenreComponent } from '../genres/genre.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component2.html',
  styleUrls: ['./header.component2.css']
})
export class HeaderComponent implements OnInit {
  title = 'IMDBLike';
  searchBarUp: any;
  leftSidebar: any;
  genresArr: Genre[] = [];
  moviesArr: any;
  public genreComponent : GenreComponent;


  constructor(private genreService: GenresService, private moviesService: MoviesapiService,private router : ActivatedRoute,
    private route : Router, private sanitizer : DomSanitizer, private renderer: Renderer2) {
      this.genreComponent = new GenreComponent(this.genreService, this.moviesService, this.router, this.sanitizer, this.route);
    }

  ngOnInit() {
    this.getGenres();
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
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