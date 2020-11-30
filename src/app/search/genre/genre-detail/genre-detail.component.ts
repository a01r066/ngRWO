import { Component, OnInit } from '@angular/core';
import {Album} from '../../../music/models/album.model';
import {FirebaseService} from '../../../firebase.service';
import {Genre} from '../../../music/models/genre.model';

@Component({
  selector: 'app-genre-detail',
  templateUrl: './genre-detail.component.html',
  styleUrls: ['./genre-detail.component.css']
})
export class GenreDetailComponent implements OnInit {
  genre: Genre;
  items: Album[] = [];

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.genre = this.firebaseService.selectedGenre;
    this.items = this.firebaseService.getAlbumsByGenre(this.genre);
  }
}
