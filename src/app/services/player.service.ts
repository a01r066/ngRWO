import {Injectable} from '@angular/core';
import {AudioService} from './audio.service';
import {StreamState} from '../interfaces/stream-state';
import {FirebaseService} from '../firebase.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  files: Array<any> = [];
  state: StreamState;
  currentFile: any = {};

  isShuffle: boolean = false;
  isRepeat: boolean = false;

  isShuffleSub = new Subject<boolean>();
  isRepeatSub = new Subject<boolean>();
  selectedRowIndexSub = new Subject<number>();
  isLikedAlbumSub = new Subject<boolean>();
  isLikedTrackSub = new Subject<boolean>();

  constructor(private audioService: AudioService,
              private firebaseService: FirebaseService) {
    // listen to stream state
    this.audioService.getState()
      .subscribe(state => {
        this.state = state;
      });
  }

  playStream(url) {
    this.audioService.playStream(url)
      .subscribe(events => {
        // listening for fun here
      });
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.stop();
    // this.playStream(file.url);
    this.playStream(file.filePath);
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.play();
  }

  stop() {
    this.audioService.stop();
  }

  getRandom(start: number, end: number){
    return Math.floor(Math.random() * end);
  }

  next() {
    let index = 0;
    if(this.isShuffle){
      index = this.getRandom(0, this.files.length);
    } else {
      if(!this.isLastPlaying()){
        index = this.currentFile.index + 1;
      } else {
        return;
      }
    }

    this.selectedRowIndexSub.next(index);

    const file = this.files[index];
    this.firebaseService.selectedTrackSub.next(file);

    this.openFile(file, index);
  }

  previous() {
    const index = this.currentFile.index - 1;
    this.selectedRowIndexSub.next(index);

    const file = this.files[index];
    this.firebaseService.selectedTrackSub.next(file);

    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }

  repeat(){
    if(this.isRepeat){
      const file = this.files[0];
      this.firebaseService.selectedTrackSub.next(file);
      this.openFile(file, 0);
    }
  }
}
