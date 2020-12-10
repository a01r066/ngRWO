import { Component, OnInit } from '@angular/core';
import {Album} from '../../../music/models/album.model';
import {FirebaseService} from '../../../firebase.service';
import {Genre} from '../../../music/models/genre.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-genre-detail',
  templateUrl: './genre-detail.component.html',
  styleUrls: ['./genre-detail.component.css']
})
export class GenreDetailComponent implements OnInit {
  genre: Genre;
  items: Album[] = [];
  isDataLoaded: boolean = false;

  constructor(private firebaseService: FirebaseService,
              private router: Router) { }

  ngOnInit(): void {
    this.genre = this.firebaseService.selectedGenre;
    this.items = this.firebaseService.getAlbumsByGenre(this.genre);
    this.firebaseService.isDataLoadedSub.subscribe(isLoaded => {
      this.isDataLoaded = isLoaded;
    });
  }

  onSelectItem(album: Album){
    this.firebaseService.selectedAlbum = album;
    this.router.navigate(['playlist', album.id]);
  }
}
