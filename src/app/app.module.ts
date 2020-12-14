import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { LibraryComponent } from './library/library.component';
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
import { CategoryComponent } from './book/category/category.component';
import { CategoryListComponent } from './book/category/category-list/category-list.component';
import { CategoryDetailComponent } from './book/category/category-detail/category-detail.component';
import { CategoryItemComponent } from './book/category/category-list/category-item/category-item.component';
import { AlertComponent } from './shared/alert/alert.component';
import { AuthAlertComponent } from './shared/auth-alert/auth-alert.component';
import { LibPlaylistsComponent } from './library/lib-playlists/lib-playlists.component';
import { LibLikedSongsComponent } from './library/lib-liked-songs/lib-liked-songs.component';
import {AuthModule} from './auth/auth.module';
import {MusicModule} from './music/music.module';
import {SharedModule} from './shared/shared.module';
import { LibAlbumsComponent } from './library/lib-albums/lib-albums.component';
import {PlaylistAlertComponent} from './library/lib-playlists/playlist-alert/playlist-alert.component';
import { PlaylistEmptyComponent } from './library/lib-playlists/playlist-empty/playlist-empty.component';
import { MenuItemComponent } from './shared/playlist/menu-item/menu-item.component';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    LibraryComponent,
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
    CategoryComponent,
    CategoryListComponent,
    CategoryDetailComponent,
    CategoryItemComponent,
    AlertComponent,
    AuthAlertComponent,
    LibPlaylistsComponent,
    LibLikedSongsComponent,
    LibAlbumsComponent,
    PlaylistAlertComponent,
    PlaylistEmptyComponent,
    MenuItemComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
