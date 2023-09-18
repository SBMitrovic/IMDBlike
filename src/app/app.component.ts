import { Component } from '@angular/core';
import { MoviesapiService } from './movies/services/moviesapi.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.sass']
})


export class AppComponent {
  title = 'IMDBlike';
  
//  private const rootUrl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=f300e933685acb83d84aa24df1bb7170';
  private readonly api_key = 'f300e933685acb83d84aa24df1bb7170';

  JSONplaceholder = 'https://jsonplaceholder.typicode.com/users';
   
  



}
