import {NgModule} from '@angular/core';
import {LibPlaylistsComponent} from './lib-playlists/lib-playlists.component';
import {LibLikedSongsComponent} from './lib-liked-songs/lib-liked-songs.component';
import {LibAlbumsComponent} from './lib-albums/lib-albums.component';
import {LibraryComponent} from './library.component';
import {SharedModule} from '../shared/shared.module';
import {LibraryRoutingModule} from './library-routing.module';
import {PlaylistAlertComponent} from './lib-playlists/playlist-alert/playlist-alert.component';
import {PlaylistEmptyComponent} from './lib-playlists/playlist-empty/playlist-empty.component';

@NgModule({
  declarations: [
    LibraryComponent,
    LibPlaylistsComponent,
    LibLikedSongsComponent,
    LibAlbumsComponent,
    PlaylistAlertComponent,
    PlaylistEmptyComponent,
  ],
  imports: [
    SharedModule,
    LibraryRoutingModule
  ],
  exports: []
})
export class LibraryModule {

}
