import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../shared/ui.service';
import {FirebaseService} from '../../firebase.service';
import {Album} from '../../music/models/album.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAuth: boolean = false;

  constructor(private authService: AuthService,
              private router: Router,
              private uiService: UiService,
              private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  onSelectLibrary(){
    if(!this.isAuth){
      // this.router.navigate(['/login']);
      // this.router.navigate(['auth']);
      this.uiService.loginAlertChanged.next(true);
    } else {
      this.router.navigate(['/library']);
    }
  }

  onCreatePlaylist(){
    const playlistID = this.firebaseService.uuid();
    this.uiService.isPlaylistEdit = true;
    const user = this.authService.getUser();
    const data = {
      title: "My Playlist #" + this.firebaseService.playlistCounter,
      author: user.email,
      imagePath: "https://firebasestorage.googleapis.com/v0/b/rxrelaxingworld.appspot.com/o/Images%2FDefaults%2Fplaylist-empty.png?alt=media&token=6a8539e3-6337-4ec6-bec1-cbeea9cc0ebf",
      tags: ""
    };

    const genreID = "";
    const trendID = "";
    let album = new Album(playlistID, genreID, trendID, data);
    this.firebaseService.selectedAlbum = album;
    this.uiService.isPlaylist = true;
    this.firebaseService.createPlaylist(user, playlistID, data);
    this.firebaseService.getPlaylists(user);
    // this.router.navigate(['playlist', playlistID]);
    this.router.navigate(['/library/playlist', album.id]);
  }
}
