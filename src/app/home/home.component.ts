import {
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import {Album} from '../music/models/album.model';
import {FirebaseService} from '../firebase.service';
import {Genre} from '../music/models/genre.model';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../auth/auth.service';
import {UiService} from '../shared/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ])
  ]
})
export class HomeComponent implements OnInit {
  counter = 8;
  size: any;
  trendingAlbumsList: Album[][];
  trends: Genre[];
  isDataLoaded = false;
  playedAlbums: Album[] = [];
  loggedIn = false;
  recentPlayed: Genre;

  constructor(private firebaseService: FirebaseService,
              private router: Router,
              private authService: AuthService,
              private uiService: UiService) {
  }

  onSelectItem(album: Album){
    this.firebaseService.selectedAlbum = album;
    this.router.navigate(['playlist', album.id]);
  }

  onClickViewAll(albums: Album[], trend: Genre){
    // this.firebaseService.trendAlbums = albums;
    this.router.navigate(['trend', trend.id]);
  }

  ngOnInit(): void {
    this.loggedIn = this.authService.loggedIn;
    if (this.loggedIn){
      const user = this.authService.getCurrentUser();
      this.firebaseService.getRecentPlayedAlbums(user);
      this.recentPlayed = new Genre('recently-played', {title: 'Recently Played', imagePath: ''});
    }
    this.uiService.playedAlbumsSub.subscribe(albums => {
      this.playedAlbums = albums;
    });

    this.size = window.innerWidth;
    this.getCounter();

    if (this.firebaseService.trends.length > 0){
      this.trends = this.firebaseService.trends;
    } else {
      this.trends = this.firebaseService.getTrends();
    }

    if (this.firebaseService.trendingList.length > 0){
      this.trendingAlbumsList = this.firebaseService.trendingList;
      this.isDataLoaded = true;
    } else {
      this.firebaseService.getTrendingList();
    }
    this.firebaseService.trendingAlbumsListSub.subscribe(trendingList => {
      this.trendingAlbumsList = trendingList;
      this.isDataLoaded = true;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.size = window.innerWidth;
    this.getCounter();
  }

  getCounter(){
    if (this.size > 2462){
      this.counter = 11;
    }
    else if (this.size > 2262){
      this.counter = 10;
    }
    else if (this.size > 2062) {
      this.counter = 9;
    } else if (this.size > 1862){
      this.counter = 8;
    } else if (this.size > 1662){
      this.counter = 7;
    }
    else if (this.size > 1462){
      this.counter = 6;
    }
    else if (this.size > 1262){
      this.counter = 5;
    } else if (this.size > 1062){
      this.counter = 4;
    } else if (this.size > 864){
      this.counter = 3;
    }
    else if (this.size > 666){
      this.counter = 2;
    } else {
      this.counter = 1;
    }
  }

  getTitle(album: Album){
    if (typeof album !== 'undefined'){
      let titleStr = album.title;
      if (titleStr.length > 42){
        titleStr = titleStr.slice(0, 38) + '...';
      }
      return titleStr;
    } else {
      return 'My Playlist';
    }
  }

  getSubTitle(album: Album){
    if (typeof album !== 'undefined'){
      let subTitleStr = album.author;
      if (subTitleStr.length > 24){
        subTitleStr = subTitleStr.slice(0, 20) + '...';
      }
      return subTitleStr;
    } else {
      return 'Optional description';
    }
  }
}
