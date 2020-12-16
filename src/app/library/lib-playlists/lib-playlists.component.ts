import {Component, OnInit, ViewChild} from '@angular/core';
import {Genre} from '../../music/models/genre.model';
import {Album} from '../../music/models/album.model';
import {FirebaseService} from '../../firebase.service';
import {Router} from '@angular/router';
import {UiService} from '../../shared/ui.service';
import {AuthService} from '../../auth/auth.service';
import {MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-lib-playlists',
  templateUrl: './lib-playlists.component.html',
  styleUrls: ['./lib-playlists.component.css']
})
export class LibPlaylistsComponent implements OnInit {
  genre: Genre;
  items: Album[] = [];
  isDataLoaded: boolean;

  options = ["Edit details", "Delete"];
  selectedPlaylist: Album;

  // we create an object that contains coordinates
  menuTopLeftPosition =  {x: '0', y: '0'}
  // reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger;

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
    this.uiService.isPlaylist = true;
    this.router.navigate(['playlist', album.id]);
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
