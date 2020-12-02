import { Component, OnInit } from '@angular/core';
import {Album} from '../../models/album.model';
import {FirebaseService} from '../../../firebase.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-trend-detail',
  templateUrl: './trend-detail.component.html',
  styleUrls: ['./trend-detail.component.css']
})
export class TrendDetailComponent implements OnInit {
  items: Album[];
  title: string;

  constructor(private firebaseService: FirebaseService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    this.title = params['id'];
    this.items = this.firebaseService.trendAlbums;
  }

  onSelectItem(album: Album){
    this.firebaseService.selectedAlbum = album;
    this.router.navigate(['playlist', album.id]);
  }
}
