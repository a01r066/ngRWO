import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LibraryComponent} from './library.component';
import {AuthGuard} from '../auth/auth.guard';
import {LibLikedSongsComponent} from './lib-liked-songs/lib-liked-songs.component';

const routes: Routes = [
  { path: '', component: LibraryComponent, canActivate: [AuthGuard], children: [
      // { path: '', component: LibPlaylistsComponent },
      // { path: 'playlist/:id', component: LibLikedSongsComponent }
    ] },
  { path: 'liked-songs', component: LibLikedSongsComponent },
  { path: 'playlist/:id', component: LibLikedSongsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule {

}
