import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Album} from '../../../music/models/album.model';
import {FirebaseService} from '../../../firebase.service';
import {Genre} from '../../../music/models/genre.model';
import {Router} from '@angular/router';
import {NavItem} from '../../../shared/nav-item';
import {MatMenuTrigger} from '@angular/material/menu';
import {UiService} from '../../../shared/ui.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-genre-detail',
  templateUrl: './genre-detail.component.html',
  styleUrls: ['./genre-detail.component.css']
})
export class GenreDetailComponent implements OnInit{
  navItems: NavItem[] = [
    {
      title: "Sort by A->Z"
    },
    {
      title: "Sort by Z->A"
    }
    // {
    //   title: "Sort by Top Listen"
    // }
  ];

  genre: Genre;

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  albums: Album[] = [];
  isLoadedAll: boolean;

  constructor(private firebaseService: FirebaseService,
              private router: Router,
              private uiService: UiService) {
  }

  ngOnInit(): void {
    this.genre = this.firebaseService.selectedGenre;
    this.uiService.isLoadedAll.subscribe(isLoaded => {
      this.isLoadedAll = isLoaded;
    });
    this.firebaseService.allAlbumsSub.subscribe(allAlbums => {
      this.firebaseService.allAlbums = allAlbums;
      this.firebaseService.getNextItems();
      this.firebaseService.albumsSubject.next(this.firebaseService.albums);
      this.albums = this.firebaseService.albums;
    });
  }

  loadMore(){
    this.firebaseService.loadMore();
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
      return "Playlist";
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
      return "";
    }
  }

  onSelecSort(index){
    if(index === 0 || index === 1){
      this.sortByName(index);
    }
  }

  sortByName(index){
    this.albums.sort((s1, s2) => {
      if(s1 === s2){
        return -1;
      }
      if(index === 0){
        return s1.title.toLowerCase().localeCompare(s2.title.toLowerCase());
      } else {
        return s2.title.toLowerCase().localeCompare(s1.title.toLowerCase());
      }
    });
  }
}
