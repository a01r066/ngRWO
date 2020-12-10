import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Album} from '../music/models/album.model';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  loadingStateChanged = new Subject<boolean>();
  loginAlertChanged = new Subject<boolean>();
  isLibraryTabsShowSub = new Subject<boolean>();
  favouritePlaylistsSub = new Subject<Album[]>();
  isLikedAlbumSub = new Subject<boolean>();
  isLikedTrackSub = new Subject<boolean>();
}
