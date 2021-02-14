import {Component, OnDestroy, OnInit} from '@angular/core';
import {Genre} from '../../../music/models/genre.model';
import {FirebaseService} from '../../../firebase.service';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.css'],
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
export class GenreListComponent implements OnInit, OnDestroy {
  genres: Genre[];
  items: any;
  isDataLoaded = false;

  constructor(private firebaseService: FirebaseService,
              private router: Router) { }

  ngOnInit(): void {
    if(this.firebaseService.genres.length > 0){
      this.genres = this.firebaseService.genres;
      this.isDataLoaded = true;
    } else {
      this.genres = this.firebaseService.getGenres();
    }

    this.firebaseService.isDataLoadedSub.subscribe(isLoaded => {
      this.isDataLoaded = isLoaded;
    });

    if (!this.firebaseService.isAllTracksLoaded){
      this.firebaseService.fetchAllTracks();
    } else {
      this.firebaseService.isAllTracksLoaded = true;
    }

    if (!this.firebaseService.isGlobalAlbumsLoaded){
      this.firebaseService.fetchAllAlbums();
    } else {
      this.firebaseService.isGlobalAlbumsLoaded = true;
    }

    this.firebaseService.isSearchBarHiddenSub.next(false);
  }

  onSelectGenre(genre: Genre){
    // refactor scroll to load more items
    this.router.navigate(['genre', genre.id]);
  }

  ngOnDestroy(): void {
    this.firebaseService.isSearchBarHiddenSub.next(true);
  }
}
