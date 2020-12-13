import {Component, OnDestroy, OnInit} from '@angular/core';
import {Album} from '../../music/models/album.model';
import {Track} from '../../music/models/track.model';
import {StreamState} from '../../interfaces/stream-state';
import {FirebaseService} from '../../firebase.service';
import {PlayerService} from '../../services/player.service';
import {UiService} from '../../shared/ui.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {AudioService} from '../../services/audio.service';
import {User} from '../../auth/user.model';
import firebase from 'firebase';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-lib-liked-songs',
  templateUrl: './lib-liked-songs.component.html',
  styleUrls: ['./lib-liked-songs.component.css']
})
export class LibLikedSongsComponent implements OnInit {

  displayedColumns: string[] = ['position', 'title', 'played', 'duration', 'option'];
  isDataLoaded: boolean = false;

  tracks: Track[];
  state: StreamState;
  selectedRowIndex = -1;
  isFirstLoad: boolean = true;
  isAuth: boolean = false;
  user: User;
  database = firebase.database();

  favouriteList: boolean[] = [];
  favouriteListSub = new Subject<boolean[]>();

  constructor(private firebaseService: FirebaseService,
              private playerService: PlayerService,
              private audioService: AudioService,
              private authService: AuthService,
              private uiService: UiService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.firebaseService.fetchFavouriteTracks(this.user);
    this.uiService.favouriteTracksSub.subscribe(tracks => {
      this.tracks = tracks;
      this.isDataLoaded = true;

      // favourite list
      tracks.forEach(track => {
        this.favouriteList.push(true);
      });
    });

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
        tags: snapshot.val().tags
      }
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
}
