import { Component, OnInit } from '@angular/core';
import {Genre} from '../../music/models/genre.model';
import {Album} from '../../music/models/album.model';
import {FirebaseService} from '../../firebase.service';
import {Router} from '@angular/router';
import {UiService} from '../../shared/ui.service';
import {AuthService} from '../../auth/auth.service';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-lib-albums',
  templateUrl: './lib-albums.component.html',
  styleUrls: ['./lib-albums.component.css'],
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
export class LibAlbumsComponent implements OnInit {
  genre: Genre;
  items: Album[] = [];
  isDataLoaded: boolean = false;

  constructor(private firebaseService: FirebaseService,
              private router: Router,
              private uiService: UiService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.firebaseService.fetchFavouriteAlbums(this.authService.getUser());
    this.uiService.favouriteAlbumsSub.subscribe(albums => {
      this.isDataLoaded = true;
      this.items = albums;
    });
  }

  onSelectItem(album: Album){
    this.firebaseService.selectedAlbum = album;
    this.router.navigate(['playlist', album.id]);
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
