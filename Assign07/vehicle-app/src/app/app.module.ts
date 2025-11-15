import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TripComponent } from './trip/trip.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppComponent,   // standalone components go here
    TripComponent,
    ReactiveFormsModule,
    FormsModule          
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
