import {Component, OnInit, ViewChild} from '@angular/core';
import {Album} from '../../music/models/album.model';
import {Track} from '../../music/models/track.model';
import {FirebaseService} from '../../firebase.service';
import {PlayerService} from '../../services/player.service';
import {StreamState} from '../../interfaces/stream-state';
import {AudioService} from '../../services/audio.service';
import {AuthService} from '../../auth/auth.service';
import {UiService} from '../ui.service';
import {ActivatedRoute} from '@angular/router';
import {MatMenuTrigger} from '@angular/material/menu';
import {NavItem} from '../nav-item';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  displayedColumns: string[] = ['position', 'title', 'played', 'duration', 'option'];
  isDataLoaded: boolean = false;
  album: Album;
  tracks: Track[];
  state: StreamState;
  selectedRowIndex = -1;
  isFirstLoad: boolean = true;
  isLikedAlbum: boolean = false;
  isAuth: boolean = false;
  favouriteList: boolean[] = [];
  playingTrack: Track;
  playlist: Album;

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  navItems: NavItem[] = [
    {
      title: "New playlist"
    }
  ];

  constructor(private firebaseService: FirebaseService,
              private playerService: PlayerService,
              private audioService: AudioService,
              private authService: AuthService,
              private uiService: UiService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.album = this.firebaseService.selectedAlbum;
    this.firebaseService.favouristAlbums.find(album => {
      if(album.id === this.album.id){
        this.isLikedAlbum = true;
      }
    });
    this.firebaseService.getTracksByAlbum();
    this.firebaseService.tracksSub.subscribe(tracks => {
      this.tracks = tracks;
      this.isDataLoaded = true;
      // favourite list
      tracks.forEach(track => {
        this.favouriteList.push(false);
      });
    });
    this.playerService.selectedRowIndexSub.subscribe(index => {
      this.selectedRowIndex = index;
    });

    this.audioService.getState().subscribe(state => {
      this.state = state;
    });

    this.uiService.isLikedAlbumSub.subscribe(isLike => {
      this.isLikedAlbum = isLike;
    });

    this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });

    this.isAuth = this.authService.isAuthenticated;
    this.uiService.favouriteListSub.subscribe(list => {
      this.favouriteList = list;
    });

    this.uiService.selectedTrackSub.subscribe(track => {
      this.playingTrack = track;
    });

    if(this.isAuth){
      this.firebaseService.getPlaylists(this.authService.getUser());
      this.uiService.favouritePlaylistsSub.subscribe(playlists => {
        // this.favouritePlaylists = playlists;
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

  getImagePath(){
    if(typeof this.album.imagePath !== 'undefined' || this.album.imagePath === ''){
      return this.album.imagePath;
    } else {
      return "https://firebasestorage.googleapis.com/v0/b/rxrelaxingworld.appspot.com/o/Images%2FDefaults%2Fplaylist-empty.png?alt=media&token=6a8539e3-6337-4ec6-bec1-cbeea9cc0ebf";
    }
  }

  getTitle(){
    if(typeof this.album.title !== 'undefined' || this.album.title !== ''){
      let titleStr = this.album.title;
      if(titleStr.length > 36){
        titleStr = titleStr.slice(0, 36) + "...";
      }
      return titleStr;
    } else {
      return "My Playlist";
    }
  }

  getSubTitle(){
    if(typeof this.album.author !== 'undefined' || this.album.author === ''){
      return this.album.author.slice(0, 64);
    } else {
      return "Description: N/A";
    }
  }

  openFile(track: Track, index: number){
    this.selectedRowIndex = index;
    if(typeof this.playingTrack !== 'undefined'){
      if(this.playingTrack.id === track.id || this.favouriteList[index] === true){
        this.uiService.isLikedTrackSub.next(true);
      } else {
        this.uiService.isLikedTrackSub.next(false);
      }
    }
    this.uiService.selectedTrackSub.next(track);
    this.uiService.selectedAlbumSub.next(this.album);
    this.playerService.files = this.tracks;
    this.playerService.openFile(track, index);
  }

  handlePlay(){
    if(this.isFirstLoad){
      this.openFile(this.tracks[0], 0);
      this.isFirstLoad = false;
    } else {
      this.play();
    }
  }

  play(){
    this.playerService.play();
  }

  pause(){
    this.playerService.pause();
  }

  onHandleLikeAlbum(album: Album){
    if(this.isAuth){
      this.isLikedAlbum = !this.isLikedAlbum;
      this.uiService.isLikedAlbumSub.next(this.isLikedAlbum);
      if(this.isLikedAlbum){
        // add to favourite
        this.firebaseService.addFavouriteAlbum(album, this.authService.getUser());
      } else {
        // remove from playlist
        this.firebaseService.removeAlbumFromFavouriteAlbums(album, this.authService.getUser());
      }
    } else {
      this.uiService.loginAlertChanged.next(true);
    }
  }

  onHandleLikeTrack(track: Track, index: number){
    if(this.isAuth){
      this.favouriteList[index] = !this.favouriteList[index];
      this.uiService.favouriteListSub.next(this.favouriteList);
      if(this.favouriteList[index]){
        // add to liked songs
        this.firebaseService.addFavouriteTrack(track, this.authService.getUser());
      } else {
        // remove from liked songs
        this.firebaseService.removeTrackFromFavouriteTracks(track, this.authService.getUser());
      }
      if(typeof this.playingTrack !== 'undefined'){
        if(this.playingTrack.id === track.id){
          this.uiService.isLikedTrackSub.next(this.favouriteList[index]);
        }
      }
    } else {
      this.uiService.loginAlertChanged.next(true);
    }
  }

  onSelectItem(item: NavItem, index: number){
    if(item.title === "New playlist"){
      if(this.isAuth){
        this.firebaseService.onCreatePlaylist();
      } else {
        this.uiService.loginAlertChanged.next(true);
      }
    } else if(item.title === 'Save to liked songs'){
      // console.log("Add to liked songs");
      this.firebaseService.addFavouriteTrack(this.tracks[index], this.authService.getUser());
    }
  }

  selectSubItem(item: Album, track: Track){
    this.firebaseService.addTrackToPlaylist(this.authService.getUser(), track, item);
  }
}
