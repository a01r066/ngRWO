import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Track} from '../../../music/models/track.model';
import {Album} from '../../../music/models/album.model';
import {FirebaseService} from '../../../firebase.service';
import firebase from 'firebase';
import {AuthService} from '../../../auth/auth.service';
import {UiService} from '../../../shared/ui.service';
import {Subscription} from 'rxjs';
import {MatMenuTrigger} from '@angular/material/menu';
import {NavItem} from '../../../shared/nav-item';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent implements OnInit, OnDestroy {
  @Input() track: Track;
  selectedAlbum: Album;
  database = firebase.database();
  @Output() onOpenFile = new EventEmitter();
  isFavourite = false;
  isAuth: boolean = false;
  playingTrack: Track;
  alertSub: Subscription;
  isAlertShow = false;

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  navItems: NavItem[] = [
    {
      title: "New playlist"
    }
  ];

  constructor(private firebaseService: FirebaseService,
              private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.getAlbumByID(this.track);
    this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
    this.alertSub = this.uiService.loginAlertChanged.subscribe(isAlert => {
      this.isAlertShow = isAlert;
    });
    this.isAuth = this.authService.isAuthenticated;

    this.uiService.selectedTrackSub.subscribe(track => {
      this.playingTrack = track;
    });

    if(this.isAuth) {
      this.firebaseService.getPlaylists(this.authService.getUser());
      this.uiService.favouritePlaylistsSub.subscribe(playlists => {
        // this.favouritePlaylists = playlists;
        this.navItems = this.navItems.slice(0, 1);
        this.navItems.push({
          title: "Add to playlist",
          subItems: playlists
        });
        this.navItems.push({
          title: "Save to liked songs"
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  openFile(track){
    if(typeof this.playingTrack !== 'undefined'){
      if(this.playingTrack.id === track.id){
        this.uiService.isLikedTrackSub.next(true);
      } else {
        this.uiService.isLikedTrackSub.next(false);
      }
    }
    this.onOpenFile.emit(track);
  }

  getAlbumByID(track: Track){
    const trendID = '';
    const genreID = track.genreID;
    const albumID = track.albumID;

    this.database.ref('Albums').child(genreID).child(albumID).once('value').then(snapshot => {
      const dataObj = {
        title: snapshot.val().title,
        author: snapshot.val().author,
        imagePath: snapshot.val().imagePath,
        tags: snapshot.val().tags,
        filePath: snapshot.val().filePath
      };
      this.selectedAlbum  = new Album(albumID, genreID, trendID, dataObj);
    });
  }

  onHandleLikeTrack(track: Track){
    if(this.isAuth){
      this.isFavourite = !this.isFavourite;
      if(this.isFavourite){
        // add to liked songs
        this.firebaseService.addFavouriteTrack(track, this.authService.getUser());
      } else {
        // remove from liked songs
        this.firebaseService.removeTrackFromFavouriteTracks(track, this.authService.getUser());
      }
      if(typeof this.playingTrack !== 'undefined'){
        if(this.playingTrack.id === track.id){
          this.uiService.isLikedTrackSub.next(this.isFavourite);
        }
      }
    } else {
      this.uiService.loginAlertChanged.next(true);
    }
  }

  onSelectItem(item: NavItem, track: Track){
    if(item.title === "New playlist"){
      if(this.isAuth){
        this.firebaseService.onCreatePlaylist();
      } else {
        this.uiService.loginAlertChanged.next(true);
      }
    } else if(item.title === 'Save to liked songs'){
      // console.log("Add to liked songs");
      this.firebaseService.addFavouriteTrack(track, this.authService.getUser());
    }
  }

  selectSubItem(item: Album, track: Track){
    // console.log("SubItem: " + item.title);
    this.firebaseService.addTrackToPlaylist(this.authService.getUser(), track, item);
  }

  getTitle(){
    if(typeof this.track !== 'undefined'){
      let titleStr = '';
      if(this.track.title !== ''){
        titleStr = this.track.title;
        if(titleStr.length > 128){
          titleStr = titleStr.slice(0, 124) + '...';
        }
      }
      return titleStr;
    } else {
      return 'N/A';
    }
  }

  getSubTitle(){
    if(typeof this.track !== 'undefined'){
      let titleStr = '';
      if(this.track.author !== ''){
        titleStr = this.track.author;
        if(titleStr.length > 128){
          titleStr = titleStr.slice(0, 124) + '...';
        }
      }
      return titleStr;
    } else {
      return 'N/A';
    }
  }
}
