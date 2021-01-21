import {Component, OnInit, ViewChild} from '@angular/core';
import {Genre} from '../../music/models/genre.model';
import {Album} from '../../music/models/album.model';
import {FirebaseService} from '../../firebase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../shared/ui.service';
import {AuthService} from '../../auth/auth.service';
import {MatMenuTrigger} from '@angular/material/menu';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-lib-playlists',
  templateUrl: './lib-playlists.component.html',
  styleUrls: ['./lib-playlists.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ])
  ]
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

  getImagePath(album: Album){
    if(typeof album.imagePath !== 'undefined' || album.imagePath === ''){
      return album.imagePath;
    } else {
      return "https://firebasestorage.googleapis.com/v0/b/rxrelaxingworld.appspot.com/o/Images%2FDefaults%2Fplaylist-empty.png?alt=media&token=6a8539e3-6337-4ec6-bec1-cbeea9cc0ebf";
    }
  }

  getTitle(album: Album){
    if(typeof album.title !== 'undefined' || album.title === ''){
      let titleStr = album.title;
      if(titleStr.length > 44){
        titleStr = titleStr.slice(0, 40) + "...";
      }
      return titleStr;
    } else {
      return "My Playlist";
    }
  }

  getSubTitle(album: Album){
    if(typeof album.author !== 'undefined' || album.author === ''){
      let subTitleStr = album.author;
      if(subTitleStr.length > 24){
        subTitleStr = subTitleStr.slice(0, 20) + " ...";
      }
      return subTitleStr;
    } else {
      return "Optional description";
    }
  }
}
