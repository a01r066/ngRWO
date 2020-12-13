import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Track} from '../../../music/models/track.model';
import {Album} from '../../../music/models/album.model';
import {FirebaseService} from '../../../firebase.service';
import firebase from 'firebase';
import {AuthService} from '../../../auth/auth.service';
import {UiService} from '../../../shared/ui.service';
import {Subscription} from 'rxjs';

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
        tags: snapshot.val().tags
      }
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
}
