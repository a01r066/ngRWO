import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SearchComponent} from './search/search.component';
import {LibraryComponent} from './library/library.component';
import {GenreListComponent} from './search/genre/genre-list/genre-list.component';
import {GenreDetailComponent} from './search/genre/genre-detail/genre-detail.component';
import {GenreComponent} from './search/genre/genre.component';
import {PlaylistComponent} from './shared/playlist/playlist.component';
import {SearchDetailComponent} from './search/search-detail/search-detail.component';
import {AuthGuard} from './auth/auth.guard';
import {LibLikedSongsComponent} from './library/lib-liked-songs/lib-liked-songs.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent, children: [
      { path: '', component: GenreListComponent },
      { path: ':id', component: SearchDetailComponent }
    ] },
  { path: 'genre', component: GenreComponent, children: [
      { path: ':id', component: GenreDetailComponent }
      // { path: ':id', component: GenreDetailContainerComponent}
    ]},
  { path: 'playlist/:id', component: PlaylistComponent },
  { path: 'album/:id', component: PlaylistComponent },
  { path: 'library', component: LibraryComponent, canActivate: [AuthGuard], children: [
      // { path: '', component: LibPlaylistsComponent },
      // { path: ':index', component: LibLikedSongsComponent }
    ] },
  { path: 'library/liked-songs', component: LibLikedSongsComponent },
  { path: 'library/playlist/:id', component: LibLikedSongsComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
