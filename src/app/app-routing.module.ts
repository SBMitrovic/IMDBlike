import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { MoviesComponent } from './movies/movies.component';


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
  }
  
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
