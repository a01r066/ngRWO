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

  getTitle(album: Album){
    if(typeof album.title !== 'undefined' || album.title === ''){
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
    if(typeof album.author !== 'undefined' || album.author === ''){
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
