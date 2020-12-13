import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Album} from '../music/models/album.model';
import {Track} from '../music/models/track.model';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  loadingStateChanged = new Subject<boolean>();
  loginAlertChanged = new Subject<boolean>();
  isLibraryTabsShowSub = new Subject<boolean>();
  favouritePlaylistsSub = new Subject<Album[]>();
  favouriteTracksSub = new Subject<Track[]>();
  isLikedAlbumSub = new Subject<boolean>();
  selectedIndexSub = new Subject<number>();
  selectedTrackSub = new Subject<Track>();
  selectedAlbumSub = new Subject<Album>();
}
