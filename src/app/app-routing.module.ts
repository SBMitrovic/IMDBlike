import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { MoviesComponent } from './components/movies/movies.component';
import { MovieDetailsModule } from './components/movie-details/movie-details.module';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { GenreComponent } from './components/genres/genre.component';
import { PersonComponent } from './components/person/person.component';
import { LoginComponent } from 'src/app/components/registration/login/login.component';
import { RegisterComponent } from 'src/app/components/registration/register/register.component';
import { PeopleComponent } from './components/people/people.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { WatchLaterComponent } from './components/watch-later/watch-later.component';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/home', pathMatch: 'full',
    //component : AppComponent --- ovako ne radi!!! 
  },
  {
    path: 'home',
      component: HomeComponent
  },
  
  {
    path: 'about',
    component: AboutComponent
  },
  
  {
    path: 'movies',
    component: MoviesComponent
  },
  {
    path: 'movies/search',
    component: MoviesComponent
  },
  {
    path: 'movies/:id',
    component: MovieDetailsComponent
  },

  {
    path: 'genres/:id',
    component: GenreComponent
  },
  {
    path: 'person/:id',
    component: PersonComponent
  },
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path : 'register',
    component : RegisterComponent
  },
  {
    path : 'people',
    component: PeopleComponent
  },
  {
    path: 'favourites',
    component: FavoritesComponent,
    canActivate: [FirebaseAuthGuard]
  },
  {
    path: 'watch-later',
    component: WatchLaterComponent,
    canActivate: [FirebaseAuthGuard]
  },
  {
    path : '**',
    redirectTo : '/home',
    pathMatch : 'full'
  }



];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
