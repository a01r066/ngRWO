import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FirebaseService} from './firebase.service';
import {AuthService} from './auth/auth.service';
import {UiService} from './shared/ui.service';
import {Album} from './music/models/album.model';
import {Track} from './music/models/track.model';
import Wave from 'wave-visualizer';
import {AudioService} from './services/audio.service';

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
              private firebaseService: FirebaseService,
              private audioService: AudioService) {
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

    // Audio visualization
    let wave = new Wave();
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(stream => {
        wave.fromStream(stream, 'output', {
          type: 'cubes',
          colors: ['#411C76', '#FFD740', '#2D2D7B'],
        });
      })
      .catch(err => {
        console.log(err.message);
      });
  }
}
