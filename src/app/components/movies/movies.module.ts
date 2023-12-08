import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//import { MovieDetailsRoutingModule } from './movie-details-routing.module';
import { MoviesComponent } from './movies.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
//import { MatDialogModule, MatIconModule } from '@angular/material';
//import { AppMovieDialogComponent } from './app-movie-dialog/app-movie-dialog.component';
//import { CarouselModule } from 'primeng/carousel';
//import { PipeModule } from 'src/app/pipe/pipe.module';


import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';

@NgModule({
  declarations: [
    MoviesComponent,
    
    
  ],
  /*
  entryComponents: [
    AppMovieDialogComponent
  ],

  */
  imports: [
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    

 //   MovieDetailsRoutingModule,
//    PipeModule,
//    MatTabsModule,
      MatDialogModule,
 //   MatIconModule,
 //   CarouselModule
  ],

})
export class MovieDetailsModule { }