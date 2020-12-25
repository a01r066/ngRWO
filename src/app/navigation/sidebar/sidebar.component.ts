import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../shared/ui.service';
import {FirebaseService} from '../../firebase.service';
import {Album} from '../../music/models/album.model';
import {MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAuth: boolean = false;
  @Input() playlists: Album[] = [];
  isShow = false;

  // we create an object that contains coordinates
  menuTopLeftPosition =  {x: '0', y: '0'}
  // reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger;
  options = ["Edit details", "Delete"];
  selectedPlaylist: Album;

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

  getTitle(playlist: Album){
    if(typeof playlist !== 'undefined'){
      let titleStr = playlist.title;
      if(titleStr.length > 20){
        titleStr = titleStr.slice(0, 16) + "...";
      }
      return titleStr;
    } else {
      return "My Playlist";
    }
  }

  onSelectItem(album: Album){
    this.firebaseService.selectedAlbum = album;
    this.uiService.isPlaylist = true;
    // this.router.navigate(['playlist', album.id]);
    this.router.navigate(['/library/playlist', album.id]);
  }

  onRightClick(event: MouseEvent, item: Album){
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();

    // we record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX - 16 + 'px';
    this.menuTopLeftPosition.y = event.clientY - 48 + 'px';

    // we open the menu
    // we pass to the menu the information about our object
    // this.matMenuTrigger.menuData = {item: item}
    this.selectedPlaylist = item;

    // we open the menu
    this.matMenuTrigger.openMenu();
  }

  onClickOption(option: string){
    if(option === "Edit details"){
      this.uiService.editPlaylistChanged.next(true);
      this.firebaseService.selectedAlbum = this.selectedPlaylist;
    } else {
      this.firebaseService.deletePlaylist(this.authService.getUser(), this.selectedPlaylist);
    }
  }
}
