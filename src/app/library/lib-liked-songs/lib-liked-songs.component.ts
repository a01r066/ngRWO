import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Album} from '../../music/models/album.model';
import {Track} from '../../music/models/track.model';
import {StreamState} from '../../interfaces/stream-state';
import {FirebaseService} from '../../firebase.service';
import {PlayerService} from '../../services/player.service';
import {UiService} from '../../shared/ui.service';
import {AuthService} from '../../auth/auth.service';
import {AudioService} from '../../services/audio.service';
import {User} from '../../auth/user.model';
import firebase from 'firebase';
import {MatMenuTrigger} from '@angular/material/menu';
import {NavItem} from '../../shared/nav-item';

@Component({
  selector: 'app-lib-liked-songs',
  templateUrl: './lib-liked-songs.component.html',
  styleUrls: ['./lib-liked-songs.component.css']
})
export class LibLikedSongsComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['position', 'title', 'played', 'duration', 'option'];
  isDataLoaded: boolean = false;

  album: Album;
  tracks: Track[];
  state: StreamState;
  selectedRowIndex = -1;
  isFirstLoad: boolean = true;
  isAuth: boolean = false;
  user: User;
  database = firebase.database();
  favouriteList: boolean[] = [];

  isPlaylist = false;
  playlistImagePath: string;

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  navItems: NavItem[] = [
    {
      title: "Remove this track"
    }
  ];

  constructor(private firebaseService: FirebaseService,
              private playerService: PlayerService,
              private audioService: AudioService,
              private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.isPlaylist = this.uiService.isPlaylist;

    this.uiService.selectedAlbumSub.subscribe(album => {
      this.album = album;
    });

    this.uiService.playlistImagePathSub.subscribe(imagePath => {
      this.playlistImagePath = imagePath;
    });

    if(this.isPlaylist){
      this.album = this.firebaseService.selectedAlbum;
      this.playlistImagePath = this.album.imagePath;
      this.firebaseService.getTracksByPlaylist(this.user);
      this.firebaseService.tracksSub.subscribe(tracks => {
        this.tracks = tracks;
        this.isDataLoaded = true;
        // favourite list
        tracks.forEach(track => {
          this.favouriteList.push(false);
        });
      });
    } else {
      this.playlistImagePath = "https://firebasestorage.googleapis.com/v0/b/rxrelaxingworld.appspot.com/o/Images%2FDefaults%2FlikedSongs.png?alt=media&token=964d390e-2075-4ff3-966c-74eef355ed0e";
      const albumID = "";
      const genreID = "";
      const trendID = "";
      const dataObj = {
        title: "Liked Songs",
        author: this.user.email,
        imagePath: this.playlistImagePath,
        tags: "",
        filePath: ""
      };
      this.album = new Album(albumID, genreID, trendID, dataObj);
      this.firebaseService.fetchFavouriteTracks(this.user);
      this.uiService.favouriteTracksSub.subscribe(tracks => {
        this.tracks = tracks;
        this.isDataLoaded = true;

        // favourite list
        tracks.forEach(track => {
          this.favouriteList.push(true);
        });
      });
    }

    this.playerService.selectedRowIndexSub.subscribe(index => {
      this.selectedRowIndex = index;
    });

    this.audioService.getState().subscribe(state => {
      this.state = state;
    });

    this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });

    this.isAuth = this.authService.isAuthenticated;
  }

  ngOnDestroy(): void {
    if(this.isPlaylist){
      this.uiService.isPlaylist = false;
    }
  }

  openFile(track: Track, index: number){
    this.selectedRowIndex = index;
    this.uiService.selectedTrackSub.next(track);
    this.uiService.isLikedTrackSub.next(true);
    this.getAlbumByID(track);
    this.playerService.files = this.tracks;
    this.playerService.openFile(track, index);
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
      const album  = new Album(albumID, genreID, trendID, dataObj);
      this.uiService.selectedAlbumSub.next(album);
    });
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

  onHandleLikeTrack(track: Track, index: number){
    if(this.isAuth){
      // remove from liked songs
      this.firebaseService.removeTrackFromFavouriteTracks(track, this.authService.getUser());
    } else {
      this.uiService.loginAlertChanged.next(true);
    }
  }

  onSelectTitle(){
    if(this.isPlaylist){
      this.uiService.editPlaylistChanged.next(true);
    }
  }

  getImagePath(){
    if(typeof this.album.imagePath !== 'undefined' || this.album.imagePath === ''){
      // return this.album.imagePath;
      return this.playlistImagePath;
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
    if(typeof this.album.author !== 'undefined'){
      let subTitleStr = this.album.author;
      if(subTitleStr.length > 36){
        subTitleStr = subTitleStr.slice(0, 32) + "...";
      }
      return subTitleStr;
    } else {
      return "Description: N/A";
    }
  }

  getTrackTitle(track: Track){
    if (typeof track.title !== 'undefined' || track.title === ''){
      let titleStr = track.title;
      if (titleStr.length > 96){
        titleStr = titleStr.slice(0, 92) + '...';
      }
      return titleStr;
    } else {
      return '';
    }
  }

  getTrackSubTitle(track: Track){
    if (typeof track.author !== 'undefined' || track.author === ''){
      let subTitleStr = track.author;
      if (subTitleStr.length > 96){
        subTitleStr = subTitleStr.slice(0, 92) + ' ...';
      }
      return subTitleStr;
    } else {
      return '';
    }
  }

  onSelectItem(item: NavItem, index: number){
    if(this.isPlaylist){
      this.firebaseService.removeTrackFromPlaylist(this.authService.getUser(), this.album, this.tracks[index]);
    } else {
      this.firebaseService.removeTrackFromFavouriteTracks(this.tracks[index], this.authService.getUser());
    }
  }

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
