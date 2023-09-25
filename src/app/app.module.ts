import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MoviesComponent } from './components/movies/movies.component';
import { GenreComponent } from './components/genres/genre.component';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PeopleComponent } from './components/people/people.component';
import { PersonComponent } from './components/person/person.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    MoviesComponent,
    GenreComponent,
    HeaderComponent,
    FooterComponent,
    PeopleComponent,
    PersonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatProgressSpinnerModule,
    MatDialogModule

  ],
  providers: [], //ovde se stavljaju zavisnosti za Dependency injection, kontejner instancira jednu instancu za cijelu aplikaciju
  bootstrap: [AppComponent, MoviesComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
