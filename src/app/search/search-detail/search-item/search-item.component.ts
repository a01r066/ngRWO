import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from '../../../music/models/track.model';
import {Album} from '../../../music/models/album.model';
import {FirebaseService} from '../../../firebase.service';
import firebase from 'firebase';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent implements OnInit {
  @Input() track: Track;
  selectedAlbum: Album;
  database = firebase.database();
  @Output() onOpenFile = new EventEmitter();

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.getAlbumByID(this.track);
  }

  openFile(track){
    // console.log("Open: " +track.title);
    this.onOpenFile.emit(track);
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
      this.selectedAlbum  = new Album(albumID, genreID, trendID, dataObj);
    });
  }
}
