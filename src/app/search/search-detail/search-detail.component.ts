import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FirebaseService} from '../../firebase.service';
import {Track} from '../../music/models/track.model';
import {Album} from '../../music/models/album.model';
import {PlayerService} from '../../services/player.service';
import firebase from 'firebase';
import {UiService} from '../../shared/ui.service';
import {AudioService} from '../../services/audio.service';
import {StreamState} from '../../interfaces/stream-state';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.css']
})
export class SearchDetailComponent implements OnInit, OnDestroy {
  isAllTracksLoaded: boolean;
  tracks: Track[];
  searchText: string;
  selectedRowIndex: number;
  database = firebase.database();
  state: StreamState;

  albums: Album[] = [];
  counter: number = 8;
  size: any;

  isGlobalAlbumLoaded: boolean = false;

  constructor(private firebaseService: FirebaseService,
              private playerService: PlayerService,
              private uiService: UiService,
              private router: Router) { }

  ngOnInit(): void {
    this.isAllTracksLoaded = this.firebaseService.isAllTracksLoaded;
    this.isGlobalAlbumLoaded = this.firebaseService.isGlobalAlbumsLoaded;

    // filter track
    this.firebaseService.searchTextSub.subscribe(searchText => {
      this.searchText = searchText;
      if(this.isAllTracksLoaded){
        this.processSearch(searchText);
      }
      else {
        this.firebaseService.allTracksSub.subscribe(tracks => {
          this.processSearch(searchText);
        });
      }
    });

    // filter album
    this.firebaseService.searchTextSub.subscribe(searchText => {
      this.searchText = searchText;
      if(this.isGlobalAlbumLoaded){
        this.processSearchAlbum(searchText);
      } else {
        this.firebaseService.globalAlbumsSub.subscribe(albums => {
          this.processSearchAlbum(searchText);
        });
      }
    });

    this.firebaseService.isSearchBarHiddenSub.next(false);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.size = window.innerWidth;
    this.getCounter();
  }

  ngOnDestroy(): void {
    this.firebaseService.isSearchBarHiddenSub.next(true);
  }

  processSearchAlbum(searchText: string){
    this.albums = this.firebaseService.globalAlbums.filter(album => {
      return album.title.toLowerCase().includes(searchText.toLowerCase());
    }).slice(0, 8);
  }

  processSearch(searchText: string){
    this.tracks = this.firebaseService.allTracks.filter(track => {
      return track.title.toLowerCase().includes(searchText.toLowerCase());
    }).slice(0, 4);
  }

  openFile(track: Track, i: number){
    this.selectedRowIndex = i;
    this.uiService.selectedTrackSub.next(track);
    this.getAlbumByID(track);
    this.playerService.files = [track];
    this.playerService.openFile(track, i);
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

  getCounter(){
    if(this.size > 2520){
      this.counter = 11;
    }
    else if(this.size > 2315){
      this.counter = 10;
    }
    else if(this.size > 2115) {
      this.counter = 9;
    } else if(this.size > 1910){
      this.counter = 8;
    } else if(this.size > 1700){
      this.counter = 7;
    }
    else if(this.size > 1500){
      this.counter = 6;
    }
    else if(this.size > 1285){
      this.counter = 5;
    } else if(this.size > 1100){
      this.counter = 4;
    }
    else if(this.size > 960){
      this.counter = 3;
    } else if(this.size > 880){
      this.counter = 3;
    }
    else if(this.size > 667){
      this.counter = 2;
    } else {
      this.counter = 1;
    }
  }

  getTitle(album: Album){
    if(typeof album !== 'undefined'){
      let titleStr = album.title;
      if(titleStr.length > 44){
        titleStr = titleStr.slice(0, 40) + "...";
      }
      return titleStr;
    } else {
      return "My Playlist";
    }
  }

  getSubTitle(album: Album){
    if(typeof album !== 'undefined'){
      let subTitleStr = album.author;
      if(subTitleStr.length > 24){
        subTitleStr = subTitleStr.slice(0, 20) + " ...";
      }
      return subTitleStr;
    } else {
      return "Optional description";
    }
  }

  onSelectItem(album: Album){
    this.firebaseService.selectedAlbum = album;
    this.router.navigate(['playlist', album.id]);
  }

  onClickViewAll(albums: Album[]){
    this.firebaseService.trendAlbums = albums;
    this.router.navigate(['trend']);
  }
}
