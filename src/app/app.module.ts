import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { LibraryComponent } from './library/library.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { GenreComponent } from './search/genre/genre.component';
import { GenreListComponent } from './search/genre/genre-list/genre-list.component';
import { GenreDetailComponent } from './search/genre/genre-detail/genre-detail.component';
import { PlaylistComponent } from './shared/playlist/playlist.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    LibraryComponent,
    SignupComponent,
    LoginComponent,
    GenreComponent,
    GenreListComponent,
    GenreDetailComponent,
    PlaylistComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
