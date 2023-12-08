import { RegistrationRoutingModule } from './registration-routing.module';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    // Own Components
   
  ],
  imports: [
    CommonModule,
    // Import our Routes for this module
    RegistrationRoutingModule,
    // Angular Forms Imports
    ReactiveFormsModule,
    FormsModule,
    // Angular Material Imports
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule

  ],
  providers: [], //ovde se stavljaju zavisnosti za Dependency injection, kontejner instancira jednu instancu za cijelu aplikaciju
  bootstrap: [RegistrationModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class RegistrationModule { }