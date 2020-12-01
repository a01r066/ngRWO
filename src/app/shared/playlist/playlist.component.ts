import { Component, OnInit } from '@angular/core';
import {Album} from '../../music/models/album.model';
import {Track} from '../../music/models/track.model';
import {FirebaseService} from '../../firebase.service';
import {PlayerService} from '../../services/player.service';
import {StreamState} from '../../interfaces/stream-state';

export interface PeriodicElement {
  title: string;
  position: number;
  played: number;
  duration: string;
  option: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, title: 'Hydrogen', played: 1.0079, duration: 'H', option: '***'},
  {position: 2, title: 'Helium', played: 4.0026, duration: 'He', option: '***'},
  {position: 3, title: 'Lithium', played: 6.941, duration: 'Li', option: '***'},
  {position: 4, title: 'Beryllium', played: 9.0122, duration: 'Be', option: '***'},
  {position: 5, title: 'Boron', played: 10.811, duration: 'B', option: '***'},
  {position: 6, title: 'Carbon', played: 12.0107, duration: 'C', option: '***'},
  {position: 7, title: 'Nitrogen', played: 14.0067, duration: 'N', option: '***'},
  {position: 8, title: 'Oxygen', played: 15.9994, duration: 'O', option: '***'},
  {position: 9, title: 'Fluorine', played: 18.9984, duration: 'F', option: '***'},
  {position: 10, title: 'Neon', played: 20.1797, duration: 'Ne', option: '***'},
];

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  displayedColumns: string[] = ['position', 'title', 'played', 'duration', 'option'];
  dataSource = ELEMENT_DATA;

  album: Album;
  tracks: Track[];
  state: StreamState;

  constructor(private firebaseService: FirebaseService,
              private playerService: PlayerService) { }

  ngOnInit(): void {
    this.album = this.firebaseService.selectedAlbum;
    this.firebaseService.getTracksByAlbum();
    this.firebaseService.tracksSub.subscribe(tracks => {
      this.tracks = tracks;
    });
  }

  openFile(track: Track, index: number){
    // console.log("Track: " + track.title);
    // console.log("Index: " + index);
    this.firebaseService.selectedTrackSub.next(track);
    this.firebaseService.selectedAlbumSub.next(this.album);
    this.playerService.files = this.tracks;
    this.playerService.openFile(track, index);
  }
}
