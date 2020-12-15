import { Component, OnInit } from '@angular/core';
import {Genre} from '../../music/models/genre.model';
import {Album} from '../../music/models/album.model';
import {FirebaseService} from '../../firebase.service';
import {Router} from '@angular/router';
import {UiService} from '../../shared/ui.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-lib-playlists',
  templateUrl: './lib-playlists.component.html',
  styleUrls: ['./lib-playlists.component.css']
})
export class LibPlaylistsComponent implements OnInit {
  genre: Genre;
  items: Album[] = [];
  isDataLoaded: boolean;

  constructor(private firebaseService: FirebaseService,
              private router: Router,
              private uiService: UiService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.firebaseService.getPlaylists(this.authService.getUser());
    this.uiService.favouritePlaylistsSub.subscribe(playlists => {
      this.items = playlists;
      this.isDataLoaded = true;
    });
  }

  onSelectItem(album: Album){
    this.firebaseService.selectedAlbum = album;
    this.router.navigate(['playlist', album.id]);
  }
}
