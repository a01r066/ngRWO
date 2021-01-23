import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
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
import { SearchDetailComponent } from './search/search-detail/search-detail.component';
import { SearchItemComponent } from './search/search-detail/search-item/search-item.component';
import { ToolbarComponent } from './navigation/toolbar/toolbar.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';
import { AlertComponent } from './shared/alert/alert.component';
import { AuthAlertComponent } from './shared/auth-alert/auth-alert.component';
import {AuthModule} from './auth/auth.module';
import {MusicModule} from './music/music.module';
import {SharedModule} from './shared/shared.module';
import { MenuItemComponent } from './shared/playlist/menu-item/menu-item.component';
import { EditPlaylistComponent } from './shared/playlist/edit-playlist/edit-playlist.component';
import {ScrollTrackerDirective} from './scroll-tracker.directive';
import { DonateComponent } from './donate/donate.component';
import {NgxPayPalModule} from 'ngx-paypal';

firebase.initializeApp(environment.firebase);

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SearchComponent,
        GenreComponent,
        GenreListComponent,
        GenreDetailComponent,
        PlaylistComponent,
        PlayerBarComponent,
        HighlightDirective,
        SearchDetailComponent,
        SearchItemComponent,
        ToolbarComponent,
        SidebarComponent,
        AlertComponent,
        AuthAlertComponent,
        MenuItemComponent,
        EditPlaylistComponent,
        ScrollTrackerDirective,
        DonateComponent,
    ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AuthModule,
    MusicModule,
    NgxPayPalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
