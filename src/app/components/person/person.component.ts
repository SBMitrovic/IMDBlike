import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MoviesapiService } from 'src/app/services/moviesapi.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})

export class PersonComponent implements OnInit {
  public id: any;
  person: any;
  // tslint:disable-next-line: variable-name
  person_cast: any = [];
  isBiographyExpanded = false;
  showAllMovies = false;

  constructor(
    private movieServices: MoviesapiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Scroll to top when component initializes
    window.scrollTo(0, 0);
    
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      // Scroll to top when route params change (navigating between different persons)
      window.scrollTo(0, 0);
      this.gerPersonDetails(this.id);
      this.getPersonCastMovie(this.id);
    });
  }

  gerPersonDetails(id : any) {
    this.movieServices.getPersonDetail(id).subscribe((res) => {
      this.person = res;
    });
  }

  getPersonCastMovie(id : any) {
    this.movieServices.getPersonCast(id).subscribe((res) => {
      this.person_cast = res.cast.sort((a: any, b: any) => {
        // Sort by popularity (vote_average) and release date
        const dateA = new Date(a.release_date || '1900-01-01').getTime();
        const dateB = new Date(b.release_date || '1900-01-01').getTime();
        return dateB - dateA;
      });
    });
  }

  getAge(birthday: string, deathday?: string): number | null {
    if (!birthday) return null;
    
    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();
    
    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getGenderText(gender: number): string {
    switch (gender) {
      case 1: return 'Female';
      case 2: return 'Male';
      case 3: return 'Non-binary';
      default: return 'Not specified';
    }
  }

  toggleBiography(): void {
    this.isBiographyExpanded = !this.isBiographyExpanded;
  }

  toggleShowAllMovies(): void {
    this.showAllMovies = !this.showAllMovies;
  }

  openMovieDetails(movieId: number): void {
    this.router.navigate(['/movies', movieId]).then(() => {
      window.scrollTo(0, 0);
    });
  }
}