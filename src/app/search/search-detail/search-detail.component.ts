import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FirebaseService} from '../../firebase.service';
import {Track} from '../../music/models/track.model';
import {Album} from '../../music/models/album.model';
import {PlayerService} from '../../services/player.service';
import firebase from 'firebase';
import {UiService} from '../../shared/ui.service';
import {StreamState} from '../../interfaces/stream-state';
import {Router} from '@angular/router';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.css'],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('.hero, form', [
          style({opacity: 0, transform: 'translateY(-100px)'}),
          stagger(-30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ]),
    trigger('filterAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(':enter', [
          style({ opacity: 0, width: '0px' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, width: '*' })),
          ]),
        ], { optional: true })
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 0, width: '0px' })),
          ]),
        ])
      ]),
    ]),
  ]
})
export class SearchDetailComponent implements OnInit, OnDestroy {
  isAllTracksLoaded: boolean;
  tracks: Track[];
  filteredTracks: Track[];
  searchText: string;
  selectedRowIndex: number;
  database = firebase.database();
  state: StreamState;

  albums: Album[] = [];
  filteredAlbums: Album[];
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
    // this.getCounter();

    // filter track
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

    // filter album
    this.firebaseService.searchTextSub.subscribe(searchText => {
      this.searchText = searchText;
      if(this.isGlobalAlbumLoaded){
        this.processSearchAlbum(this.searchText);
      } else {
        this.firebaseService.globalAlbumsSub.subscribe(albums => {
          this.processSearchAlbum(this.searchText);
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
    this.filteredAlbums = this.firebaseService.globalAlbums.filter(album => {
      // tslint:disable-next-line:max-line-length
      if(album.title !== null){
        // tslint:disable-next-line:max-line-length
        return (album.title.toLowerCase().includes(searchText.toLowerCase()) || album.author.toLowerCase().includes(searchText.toLowerCase()));
      }
    });
    this.albums = this.filteredAlbums.slice(0, 8);
  }

  processSearch(searchText: string){
    this.filteredTracks = this.firebaseService.allTracks.filter(track => {
      return track.title.toLowerCase().includes(searchText.toLowerCase());
    });
    this.tracks = this.filteredTracks.slice(0, 6);
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
        tags: snapshot.val().tags,
        filePath: snapshot.val().filePath
      };
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
    this.router.navigate(['search', this.searchText, "albums"]);
  }

  onClickViewAllTracks(tracks: Track[]){

  }
}
