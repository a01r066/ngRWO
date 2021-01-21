import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseService} from '../../../firebase.service';
import {UiService} from '../../../shared/ui.service';
import {AuthService} from '../../../auth/auth.service';
import {Album} from '../../../music/models/album.model';

@Component({
  selector: 'app-playlist-alert',
  templateUrl: './playlist-alert.component.html',
  styleUrls: ['./playlist-alert.component.css']
})
export class PlaylistAlertComponent implements OnInit {

  constructor(private router: Router,
              private firebaseService: FirebaseService,
              private uiService: UiService,
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  onCreatePlaylist(){
    const playlistID = this.firebaseService.uuid();
    this.uiService.isPlaylistEdit = true;
    const user = this.authService.getUser();
    const data = {
      title: 'My Playlist #' + this.firebaseService.playlistCounter,
      author: user.email,
      imagePath: 'https://firebasestorage.googleapis.com/v0/b/rxrelaxingworld.appspot.com/o/Images%2FDefaults%2Fplaylist-empty.png?alt=media&token=6a8539e3-6337-4ec6-bec1-cbeea9cc0ebf',
      tags: '',
      filePath: ''
    };
    const genreID = '';
    const trendID = '';
    const newPlaylist = new Album(playlistID, genreID, trendID, data);
    this.firebaseService.selectedAlbum = newPlaylist;
    this.uiService.isPlaylist = true;
    this.firebaseService.createPlaylist(user, playlistID, data);
    // this.router.navigate(['library/playlist', playlistID]);
    this.router.navigate(['library/playlist', playlistID]);
  }
}
