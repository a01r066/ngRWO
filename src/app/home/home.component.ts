import {Component, HostListener, OnInit} from '@angular/core';
import {Album} from '../music/models/album.model';
import {FirebaseService} from '../firebase.service';
import {Genre} from '../music/models/genre.model';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';

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
  counter: number = 8;f
  size: any;
  trendingAlbumsList: Album[][];
  trends: Genre[];
  isDataLoaded: boolean = false;

  constructor(private firebaseService: FirebaseService,
              private router: Router) {
  }

  onSelectItem(album: Album){
    this.firebaseService.selectedAlbum = album;
    this.router.navigate(['playlist', album.id]);
  }

  onClickViewAll(albums: Album[], title: string){
    this.firebaseService.trendAlbums = albums;
    this.router.navigate(['trend', title]);
  }

  ngOnInit(): void {
    this.size = window.innerWidth;
    this.getCounter();
    this.trends = this.firebaseService.getTrends();
    this.firebaseService.getTrendingList();
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
}
