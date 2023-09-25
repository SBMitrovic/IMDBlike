import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MoviesapiService } from 'src/app/services/moviesapi.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})

export class PersonComponent implements OnInit {
  public id: any;
  person: any;
  // tslint:disable-next-line: variable-name
  person_cast: any = [];

  constructor(
    private movieServices: MoviesapiService,
    private router: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.router.params.subscribe((params: Params) => {
      this.id = params['id'];
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
      this.person_cast = res.cast;
    });
  }

}