import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {Album} from '../../music/models/album.model';
import {Track} from '../../music/models/track.model';
import {FirebaseService} from '../../firebase.service';
import {PlayerService} from '../../services/player.service';
import {StreamState} from '../../interfaces/stream-state';
import {AudioService} from '../../services/audio.service';
import {AuthService} from '../../auth/auth.service';
import {UiService} from '../ui.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

export interface PeriodicElement {
  title: string;
  position: number;
  played: number;
  duration: string;
  option: string;
}

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'title', 'played', 'duration', 'option'];
  isDataLoaded: boolean = false;

  album: Album;
  tracks: Track[];
  state: StreamState;
  selectedRowIndex = -1;
  isFirstLoad: boolean = true;
  isLikedAlbum: boolean = false;
  isLikedTrack: boolean = false;
  isAuth: boolean = false;
  isAlertShow = false;
  alertSub: Subscription;

  constructor(private firebaseService: FirebaseService,
              private playerService: PlayerService,
              private audioService: AudioService,
              private authService: AuthService,
              private uiService: UiService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.album = this.firebaseService.selectedAlbum;
    this.firebaseService.favouristPlaylists.find(album => {
      if(album.id === this.album.id){
        this.isLikedAlbum = true;
      }
    });

    this.firebaseService.getTracksByAlbum();
    this.firebaseService.tracksSub.subscribe(tracks => {
      this.tracks = tracks;
      this.isDataLoaded = true;
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

    this.uiService.isLikedTrackSub.subscribe(isLike => {
      this.isLikedTrack = isLike;
    });

    this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });

    this.alertSub = this.uiService.loginAlertChanged.subscribe(isAlert => {
      this.isAlertShow = isAlert;
    });

    this.isAuth = this.authService.isAuthenticated;
  }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  openFile(track: Track, index: number){
    this.selectedRowIndex = index;
    this.firebaseService.selectedTrackSub.next(track);
    this.firebaseService.selectedAlbumSub.next(this.album);
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
        this.firebaseService.addFavouritePlaylist(album, this.authService.getUser());
      } else {
        // remove from playlist
        this.firebaseService.removeAlbumFromFavouritePlaylists(album, this.authService.getUser());
      }
    } else {
      this.uiService.loginAlertChanged.next(true);
    }
  }

  onHandleLikeTrack(index: number){
    if(this.isAuth){
      this.isLikedTrack = true;
      this.uiService.isLikedTrackSub.next(this.isLikedTrack);
    } else {
      this.uiService.loginAlertChanged.next(true);
    }
  }
}
