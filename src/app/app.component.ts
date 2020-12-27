import {Component, ElementRef, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FirebaseService} from './firebase.service';
import {AuthService} from './auth/auth.service';
import {UiService} from './shared/ui.service';
import { EventEmitter } from '@angular/core';
import {Album} from './music/models/album.model';
import {Track} from './music/models/track.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Relaxing World Online';
  opened: boolean = true;
  mode = new FormControl('side');
  isAlertShow = false;
  isEditPlaylistShow = false;

  isGenreSelect = false;

  playlists: Album[] = [];
  currentTrack: Track;

  constructor(private authService: AuthService,
              private uiService: UiService,
              private firebaseService: FirebaseService) {
  }

  ngOnInit(): void {
    this.authService.initAuthListener();
    this.uiService.loginAlertChanged.subscribe(isAlert => {
      this.isAlertShow = isAlert;
    });
    this.uiService.editPlaylistChanged.subscribe(isEdit => {
      this.isEditPlaylistShow = isEdit;
    });

    this.uiService.isGenreSelectSub.subscribe(isGenreSelect => {
      this.isGenreSelect = isGenreSelect;
    });

    this.authService.authChangeSub.subscribe(authStatus => {
      if(authStatus){
        this.firebaseService.getPlaylists(this.authService.getUser());
      }
    });

    this.uiService.favouritePlaylistsSub.subscribe(playlists => {
      this.playlists = playlists.slice(0, 9);
    });
  }
}
