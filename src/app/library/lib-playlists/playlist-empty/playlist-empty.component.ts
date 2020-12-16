import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-playlist-empty',
  templateUrl: './playlist-empty.component.html',
  styleUrls: ['./playlist-empty.component.css']
})
export class PlaylistEmptyComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onAddSong(){
    this.router.navigate(['/search']);
  }

}
