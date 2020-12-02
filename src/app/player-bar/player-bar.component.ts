import { Component, OnInit } from '@angular/core';
import {Album} from '../music/models/album.model';
import {FirebaseService} from '../firebase.service';
import {Track} from '../music/models/track.model';
import {PlayerService} from '../services/player.service';
import {StreamState} from '../interfaces/stream-state';
import {AudioService} from '../services/audio.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.css']
})
export class PlayerBarComponent implements OnInit {
  files: Array<any> = [
    { name: "First Song", artist: "Inder" },
    { name: "Second Song", artist: "You" }
  ];
  state: StreamState;
  currentFile: any = {};
  isShuffle: boolean;
  isRepeat: boolean;

  album: Album;
  track: Track;

  isFirstPlaying() {
    return this.playerService.isFirstPlaying();
  }
  isLastPlaying() {
    return this.playerService.isLastPlaying();
  }

  constructor(private firebaseService: FirebaseService,
              private playerService: PlayerService,
              private audioService: AudioService,
              private router: Router) { }

  ngOnInit(): void {
    this.firebaseService.selectedTrackSub.subscribe(track => {
      this.track = track;
    });
    this.firebaseService.selectedAlbumSub.subscribe(album => {
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
  }

  play(){
    this.playerService.play();
  }

  pause(){
    this.playerService.pause();
  }

  next(){
    this.playerService.next();
  }

  previous(){
    if(!this.playerService.isFirstPlaying()){
      this.playerService.previous();
    }
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
}