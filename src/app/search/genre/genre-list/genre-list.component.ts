import { Component, OnInit } from '@angular/core';
import {Genre} from '../../../music/models/genre.model';
import {FirebaseService} from '../../../firebase.service';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.css']
})
export class GenreListComponent implements OnInit {
  genres: Genre[];
  items: any;
  isDataLoaded: boolean = false;

  constructor(private firebaseService: FirebaseService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadGenres();
    this.firebaseService.isDataLoadedSub.subscribe(isLoaded => {
      this.isDataLoaded = isLoaded
    });
  }

  loadGenres(){
    this.genres = this.firebaseService.getGenres();
  }

  onSelectGenre(genre: Genre){
    this.firebaseService.selectedGenre = genre;
    this.router.navigate(['genre', genre.title]);
  }
}
