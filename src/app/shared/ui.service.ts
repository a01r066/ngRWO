import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Album} from '../music/models/album.model';
import {Track} from '../music/models/track.model';
import {User} from '../auth/user.model';
import {Genre} from '../music/models/genre.model';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  loadingStateChanged = new Subject<boolean>();
  loginAlertChanged = new Subject<boolean>();
  isLibraryTabsShowSub = new Subject<boolean>();
  favouriteAlbumsSub = new Subject<Album[]>();
  favouriteTracksSub = new Subject<Track[]>();
  isLikedAlbumSub = new Subject<boolean>();
  isLikedTrackSub = new Subject<boolean>();
  selectedIndexSub = new Subject<number>();
  selectedTrackSub = new Subject<Track>();
  selectedAlbumSub = new Subject<Album>();
  favouriteListSub = new Subject<boolean[]>();
  currentIndexSub = new Subject<number>();
  isPlaylistEdit = false;
  isPlaylist = false;
  favouritePlaylistsSub = new Subject<Album[]>();
  editPlaylistChanged = new Subject<boolean>();
  playlistImagePathSub = new Subject<string>();
  isLoadedAll = new Subject<boolean>();
  isGenreSelectSub = new Subject<boolean>();
  playedAlbumsSub = new Subject<Album[]>();
  dbUserSub = new Subject<User>();
  selectedGenreSub = new Subject<Genre>();
}
