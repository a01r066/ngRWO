import {Component, OnDestroy, OnInit} from '@angular/core';
import {FirebaseService} from '../../firebase.service';
import {Track} from '../../music/models/track.model';
import {Album} from '../../music/models/album.model';
import {PlayerService} from '../../services/player.service';
import firebase from 'firebase';
import {UiService} from '../../shared/ui.service';

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

  constructor(private firebaseService: FirebaseService,
              private playerService: PlayerService,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.isAllTracksLoaded = this.firebaseService.isAllTracksLoaded;

    this.firebaseService.searchTextSub.subscribe(searchText => {
      this.searchText = searchText;
      if(this.isAllTracksLoaded){
        this.processSearch(this.searchText);
      }
      else {
        this.firebaseService.allTracksSub.subscribe(tracks => {
          this.processSearch(this.searchText);
        });
      }
    });

    this.firebaseService.isSearchBarHiddenSub.next(false);
  }

  ngOnDestroy(): void {
    this.firebaseService.isSearchBarHiddenSub.next(true);
  }

  processSearch(searchText: string){
    this.tracks = this.firebaseService.allTracks.filter(track => {
      return track.title.toLowerCase().includes(searchText.toLowerCase());
    }).slice(0, 15);
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
}
