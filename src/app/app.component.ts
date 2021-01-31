import {AfterViewInit, Component, OnChanges, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FirebaseService} from './firebase.service';
import {AuthService} from './auth/auth.service';
import {UiService} from './shared/ui.service';
import {Album} from './music/models/album.model';
import {Track} from './music/models/track.model';
import {AudioService} from './services/audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Relaxing World Online';
  opened = true;
  mode = new FormControl('side');
  isAlertShow = false;
  isEditPlaylistShow = false;

  isGenreSelect = false;

  playlists: Album[] = [];

  constructor(private authService: AuthService,
              private uiService: UiService,
              private firebaseService: FirebaseService) {
  }

  ngOnInit(): void {
    // disable right-click
    window.addEventListener('contextmenu', (e) => {
      // do something here...
      e.preventDefault();
    }, false);

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
      if (authStatus){
        this.firebaseService.getPlaylists(this.authService.getUser());
      }
    });

    this.uiService.favouritePlaylistsSub.subscribe(playlists => {
      this.playlists = playlists.slice(0, 9);
    });
  }
}
