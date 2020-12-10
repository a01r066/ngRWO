import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SearchComponent} from './search/search.component';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {LibraryComponent} from './library/library.component';
import {GenreListComponent} from './search/genre/genre-list/genre-list.component';
import {GenreDetailComponent} from './search/genre/genre-detail/genre-detail.component';
import {GenreComponent} from './search/genre/genre.component';
import {PlaylistComponent} from './shared/playlist/playlist.component';
import {TrendComponent} from './music/trend/trend.component';
import {TrendDetailComponent} from './music/trend/trend-detail/trend-detail.component';
import {SearchDetailComponent} from './search/search-detail/search-detail.component';
import {AuthGuard} from './auth/auth.guard';
import {LibPlaylistsComponent} from './library/lib-playlists/lib-playlists.component';
import {LibLikedSongsComponent} from './library/lib-liked-songs/lib-liked-songs.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent, children: [
      { path: '', component: GenreListComponent },
      { path: ':id', component: SearchDetailComponent }
    ] },
  { path: 'genre', component: GenreComponent, children: [
      { path: ':id', component: GenreDetailComponent }
    ]},
  { path: 'trend', component: TrendComponent, children: [
      { path: ':id', component: TrendDetailComponent },
    ]},
  { path: 'playlist/:id', component: PlaylistComponent },
  { path: 'album/:id', component: PlaylistComponent },
  { path: 'library', component: LibraryComponent, canActivate: [AuthGuard], children: [
      { path: '', component: LibPlaylistsComponent },
      { path: ':index', component: LibLikedSongsComponent }
    ] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
