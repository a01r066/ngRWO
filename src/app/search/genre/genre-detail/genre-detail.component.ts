import {Component, OnInit, ViewChild} from '@angular/core';
import {Album} from '../../../music/models/album.model';
import {FirebaseService} from '../../../firebase.service';
import {Genre} from '../../../music/models/genre.model';
import {Router} from '@angular/router';
import {NavItem} from '../../../shared/nav-item';
import {MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-genre-detail',
  templateUrl: './genre-detail.component.html',
  styleUrls: ['./genre-detail.component.css']
})
export class GenreDetailComponent implements OnInit {
  genre: Genre;
  items: Album[] = [];
  isDataLoaded: boolean = false;

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

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

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

  onSelecSort(index){
    if(index === 0 || index === 1){
      this.sortByName(index);
    }
  }

  sortByName(index){
    this.items.sort((s1, s2) => {
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

  sortByTopListen(){

  }
}
