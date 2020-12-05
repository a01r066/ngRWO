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
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAnalyticsModule} from '@angular/fire/analytics';
import firebase from 'firebase';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import { PlayerBarComponent } from './player-bar/player-bar.component';
import {HighlightDirective} from './highlight.directive';
import { TrendComponent } from './music/trend/trend.component';
import { TrendDetailComponent } from './music/trend/trend-detail/trend-detail.component';
import { SearchDetailComponent } from './search/search-detail/search-detail.component';
import { SearchItemComponent } from './search/search-detail/search-item/search-item.component';
import { ToolbarComponent } from './navigation/toolbar/toolbar.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';
import { CategoryComponent } from './book/category/category.component';
import { CategoryListComponent } from './book/category/category-list/category-list.component';
import { CategoryDetailComponent } from './book/category/category-detail/category-detail.component';
import { CategoryItemComponent } from './book/category/category-list/category-item/category-item.component';

firebase.initializeApp(environment.firebase);

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
    PlaylistComponent,
    PlayerBarComponent,
    HighlightDirective,
    TrendComponent,
    TrendDetailComponent,
    SearchDetailComponent,
    SearchItemComponent,
    ToolbarComponent,
    SidebarComponent,
    CategoryComponent,
    CategoryListComponent,
    CategoryDetailComponent,
    CategoryItemComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
