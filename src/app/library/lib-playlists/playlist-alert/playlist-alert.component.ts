import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FirebaseService} from '../../../firebase.service';
import {UiService} from '../../../shared/ui.service';
import {AuthService} from '../../../auth/auth.service';

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
      title: "My Playlist",
      author: user.email,
      imagePath: "https://firebasestorage.googleapis.com/v0/b/rxrelaxingworld.appspot.com/o/Images%2FDefaults%2Fplaylist-empty.png?alt=media&token=6a8539e3-6337-4ec6-bec1-cbeea9cc0ebf"
    };
    this.firebaseService.createPlaylist(user, playlistID, data);
    this.router.navigate(['playlist', playlistID]);
  }
}
