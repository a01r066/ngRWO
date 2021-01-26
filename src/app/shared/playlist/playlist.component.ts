import {Component, OnInit, ViewChild} from '@angular/core';
import {Album} from '../../music/models/album.model';
import {Track} from '../../music/models/track.model';
import {FirebaseService} from '../../firebase.service';
import {PlayerService} from '../../services/player.service';
import {StreamState} from '../../interfaces/stream-state';
import {AudioService} from '../../services/audio.service';
import {AuthService} from '../../auth/auth.service';
import {UiService} from '../ui.service';
import {MatMenuTrigger} from '@angular/material/menu';
import {NavItem} from '../nav-item';
import {Sort} from '@angular/material/sort';
import * as moment from 'moment';
import {FacebookService, UIParams, UIResponse} from 'ngx-facebook';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})

export class PlaylistComponent implements OnInit {
  displayedColumns: string[] = ['position', 'title', 'played', 'duration', 'option'];
  isDataLoaded = false;
  album: Album;
  tracks: Track[];
  state: StreamState;
  selectedRowIndex = -1;
  isFirstLoad = true;
  isLikedAlbum = false;
  isAuth = false;
  favouriteList: boolean[] = [];
  playingTrack: Track;
  playlist: Album;
  isFileExisted = false;

  totalMins = 0;
  totalSecs = 0;
  totalDuration = 'N/A';
  totalLiked = 0;

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  navItems: NavItem[] = [
    {
      title: 'New playlist'
    }
  ];

  durations: Array<string> = [];

  constructor(private firebaseService: FirebaseService,
              private playerService: PlayerService,
              private audioService: AudioService,
              private authService: AuthService,
              private uiService: UiService,
              private fb: FacebookService) { }

  ngOnInit(): void {
    this.totalLiked = this.firebaseService.getRandomPlayed(99, 9999);
    this.album = this.firebaseService.selectedAlbum;
    if (typeof this.album.filePath !== 'undefined'){
      this.isFileExisted = true;
    }
    this.firebaseService.favouristAlbums.find(album => {
      if (album.id === this.album.id){
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
        // get mp3 duration
        // this.getMp3Duration(track);
        if (typeof track.duration !== 'undefined'){
          this.analyzeDuration(track);
        }
      });
      this.getTotalDurations();
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

    if (this.isAuth){
      this.firebaseService.getPlaylists(this.authService.getUser());
      this.uiService.favouritePlaylistsSub.subscribe(playlists => {
        // this.favouritePlaylists = playlists;
        this.navItems.push({
          title: 'Add to playlist',
          subItems: playlists
        });
        this.navItems.push({
          title: 'Save to liked songs'
        });
      });
    }
  }

  getTotalDurations(){
    const totalSecs = this.totalMins * 60 + this.totalSecs;
    if(totalSecs > 0){
      this.totalDuration = this.formatTime(totalSecs, 'HH:mm:ss');
    }
  }

  analyzeDuration(track: Track){
    const durationStr = track.duration;
    const minStr = durationStr.slice(0, 2);
    const secondStr = durationStr.slice(3, 5);

    // tslint:disable-next-line:radix
    const min = parseInt(minStr);
    // tslint:disable-next-line:radix
    const sec = parseInt(secondStr);

    this.totalMins += min;
    this.totalSecs += sec;
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

  getImagePath(){
    if (typeof this.album.imagePath !== 'undefined' || this.album.imagePath === ''){
      return this.album.imagePath;
    } else {
      return 'https://firebasestorage.googleapis.com/v0/b/rxrelaxingworld.appspot.com/o/Images%2FDefaults%2Fplaylist-empty.png?alt=media&token=6a8539e3-6337-4ec6-bec1-cbeea9cc0ebf';
    }
  }

  getTitle(){
    if (typeof this.album.title !== 'undefined'){
      let titleStr = this.album.title;
      if (titleStr.length > 36){
        titleStr = titleStr.slice(0, 32) + '...';
      }
      return titleStr;
    } else {
      return 'My Playlist';
    }
  }

  getSubTitle(){
    if (typeof this.album.author !== 'undefined'){
      let subTitleStr = this.album.author;
      if (subTitleStr.length > 64){
        subTitleStr = subTitleStr.slice(0, 60) + '...';
      }
      return subTitleStr;
    } else {
      return 'Description: N/A';
    }
  }

  openFile(track: Track, index: number){
    this.selectedRowIndex = index;
    if (typeof this.playingTrack !== 'undefined'){
      if (this.playingTrack.id === track.id || this.favouriteList[index] === true){
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
    if (this.isFirstLoad){
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
    if (this.isAuth){
      this.isLikedAlbum = !this.isLikedAlbum;
      this.uiService.isLikedAlbumSub.next(this.isLikedAlbum);
      if (this.isLikedAlbum){
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
    if (this.isAuth){
      this.favouriteList[index] = !this.favouriteList[index];
      this.uiService.favouriteListSub.next(this.favouriteList);
      if (this.favouriteList[index]){
        // add to liked songs
        this.firebaseService.addFavouriteTrack(track, this.authService.getUser());
      } else {
        // remove from liked songs
        this.firebaseService.removeTrackFromFavouriteTracks(track, this.authService.getUser());
      }
      if (typeof this.playingTrack !== 'undefined'){
        if (this.playingTrack.id === track.id){
          this.uiService.isLikedTrackSub.next(this.favouriteList[index]);
        }
      }
    } else {
      this.uiService.loginAlertChanged.next(true);
    }
  }

  onSelectItem(item: NavItem, index: number){
    if (item.title === 'New playlist'){
      if (this.isAuth){
        this.firebaseService.onCreatePlaylist();
      } else {
        this.uiService.loginAlertChanged.next(true);
      }
    } else if (item.title === 'Save to liked songs'){
      // console.log("Add to liked songs");
      this.firebaseService.addFavouriteTrack(this.tracks[index], this.authService.getUser());
    }
  }

  selectSubItem(item: Album, track: Track){
    this.firebaseService.addTrackToPlaylist(this.authService.getUser(), track, item);
  }

  sortData(sort: Sort){
  }

  getMp3Duration(track: Track){
    // Create a non-dom allocated Audio element
    const au = document.createElement('audio');

// Define the URL of the MP3 audio file
    au.src = track.filePath;

// Once the metadata has been loaded, display the duration in the console
    au.addEventListener('loadedmetadata', () => {
      // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
      const duration = au.duration;
      console.log('The duration of the song is of: ' + duration + ' seconds');
      const durationStr = this.formatTime(duration, 'mm:ss');
      this.durations.push(durationStr);

      // example 12.3234 seconds
      // console.log("The duration of the song is of: " + duration + " seconds");
      // Alternatively, just display the integer value with
      // parseInt(duration)
      // 12 seconds
    });
  }

  formatTime(time: number, format: string = 'HH:mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  openPdf(){
    if (this.isAuth){
      window.open(this.album.filePath, '_blank');
    } else {
      this.uiService.loginAlertChanged.next(true);
    }
  }

  share() {
    const filePath = 'https://mytunes.top/';
    const params: UIParams = {
      href: filePath,
      method: 'share'
    };

    this.fb.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));
  }
}
