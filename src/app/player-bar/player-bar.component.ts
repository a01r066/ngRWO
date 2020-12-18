import {Component, OnDestroy, OnInit} from '@angular/core';
import {Album} from '../music/models/album.model';
import {FirebaseService} from '../firebase.service';
import {Track} from '../music/models/track.model';
import {PlayerService} from '../services/player.service';
import {StreamState} from '../interfaces/stream-state';
import {AudioService} from '../services/audio.service';
import {Router} from '@angular/router';
import {UiService} from '../shared/ui.service';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.css']
})
export class PlayerBarComponent implements OnInit, OnDestroy {
  state: StreamState;
  currentFile: any = {};
  isShuffle: boolean;
  isRepeat: boolean;

  album: Album;
  track: Track;

  currentVolumn = 0.75;
  isFavouriteTrack: boolean = false;

  isAuth: boolean = false;
  alertSub: Subscription;
  isAlertShow = false;
  favouriteList: boolean[] = [];
  currentIndex: number;

  isFirstPlaying() {
    return this.playerService.isFirstPlaying();
  }
  isLastPlaying() {
    return this.playerService.isLastPlaying();
  }

  constructor(private firebaseService: FirebaseService,
              private playerService: PlayerService,
              private audioService: AudioService,
              private router: Router,
              private uiService: UiService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.uiService.selectedTrackSub.subscribe(track => {
      this.track = track;
    });
    this.uiService.selectedAlbumSub.subscribe(album => {
      this.album = album;
    });

    // listen to stream state
    this.audioService.getState().subscribe(state => {
      this.state = state;

      // Ended play next
      if (state.currentTime >= state.duration) {
        if (!this.playerService.isLastPlaying()) {
          this.playerService.next();
        } else {
          if(this.isRepeat){
            this.playerService.repeat();
          }
        }
      }
    });

    // this.playerService.isShuffleSub.subscribe(isShuffle => {
    //   this.isShuffle = isShuffle;
    // });
    this.playerService.isShuffleSub.subscribe(isShuffle => {
      this.isShuffle = isShuffle;
    });

    this.playerService.isRepeatSub.subscribe(isRepeat => {
      this.isRepeat = isRepeat;
    });

    this.alertSub = this.uiService.loginAlertChanged.subscribe(isAlert => {
      this.isAlertShow = isAlert;
    });

    this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });

    this.uiService.isLikedTrackSub.subscribe(isLike => {
      this.isFavouriteTrack = isLike;
    });

    this.uiService.favouriteListSub.subscribe(list => {
      this.favouriteList = list;
    });

    this.uiService.currentIndexSub.subscribe(index => {
      this.currentIndex = index;
    });
  }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  play(){
    this.playerService.play();
  }

  pause(){
    this.playerService.pause();
  }

  next(){
    if(this.playerService.files.length > 1){
      this.playerService.next();
    } else {
      this.playerService.pause();
    }
    this.isFavouriteTrack = this.favouriteList[this.currentIndex];
  }

  previous(){
    if(this.playerService.files.length > 1){
      if(!this.playerService.isFirstPlaying()){
        this.playerService.previous();
      }
    } else {
      this.playerService.pause();
    }
    this.isFavouriteTrack = this.favouriteList[this.currentIndex];
  }

  shuffle(){
    this.isShuffle = !this.isShuffle;
    this.playerService.isShuffle = this.isShuffle;
    this.playerService.isShuffleSub.next(this.isShuffle);
  }

  repeat(){
    this.isRepeat = !this.isRepeat;
    this.playerService.isRepeat = this.isRepeat;
    this.playerService.isRepeatSub.next(this.isRepeat);
  }

  onSliderChangeEnd(change) {
    this.playerService.onSliderChangeEnd(change);
  }

  openPlaylist(track: Track){
    // console.log("Track: " + track.title + ". GenreID: " + track.genreID + ". AlbumID: " + track.albumID);
    this.firebaseService.selectedAlbum = this.album;
    this.router.navigate(['album', track.albumID]);
  }

  onVolumnChange(value){
    this.currentVolumn = value;
    this.audioService.setVolumn(value);
  }

  onResetVolumn(){
    if(this.currentVolumn !== 0){
      this.currentVolumn = 0;
    } else {
      this.currentVolumn = 0.75;
    }
    this.audioService.setVolumn(this.currentVolumn);
  }

  onHandleLikeTrack(track: Track){
    if(this.isAuth){
      if(typeof track !== 'undefined'){
        this.isFavouriteTrack = !this.isFavouriteTrack;
        if(this.isFavouriteTrack){
          // add to liked songs
          this.firebaseService.addFavouriteTrack(track, this.authService.getUser());
        } else {
          // remove from liked songs
          this.firebaseService.removeTrackFromFavouriteTracks(track, this.authService.getUser());
        }
      } else {
        console.log("Empty track");
      }
    } else {
      this.uiService.loginAlertChanged.next(true);
    }
  }

  getTitle(){
    if(typeof this.track.title !== 'undefined' || this.track.title !== ''){
      let titleStr = this.track.title;
      if(titleStr.length > 64){
        titleStr = titleStr.slice(0, 60) + "...";
      }
      return titleStr;
    } else {
      return "My Playlist";
    }
  }

  getSubTitle(){
    if(typeof this.track.author !== 'undefined' || this.track.author === ''){
      return this.track.author.slice(0, 32);
    } else {
      return "Description: N/A";
    }
  }
}
