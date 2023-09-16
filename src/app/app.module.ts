import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [], //ovde se stavljaju zavisnosti za Dependency injection, kontejner instancira jednu instancu za cijelu aplikaciju
  bootstrap: [AppComponent]
})
export class AppModule { }
