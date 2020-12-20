import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Album} from '../../../music/models/album.model';
import {FirebaseService} from '../../../firebase.service';
import {UiService} from '../../../shared/ui.service';

@Component({
  selector: 'app-genre-detail-container',
  templateUrl: './genre-detail-container.component.html',
  styleUrls: ['./genre-detail-container.component.css']
})
export class GenreDetailContainerComponent implements OnInit {
  albums$: Observable<Array<Album>>;
  isLoadedAll: boolean;

  constructor(private firebaseService: FirebaseService,
              private uiService: UiService) {
  }

  loadMore(){
    this.firebaseService.loadMore();
  }

  ngOnInit(): void {
    this.uiService.isLoadedAll.subscribe(isLoaded => {
      this.isLoadedAll = isLoaded;
    });
    this.firebaseService.allAlbumsSub.subscribe(allAlbums => {
      this.firebaseService.allAlbums = allAlbums;
      this.firebaseService.getNextItems();
      this.firebaseService.albumsSubject.next(this.firebaseService.albums);
      this.albums$ = this.firebaseService.albums$;
    });
  }
}
