import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Album} from '../../../music/models/album.model';
import {FirebaseService} from '../../../firebase.service';
import {Genre} from '../../../music/models/genre.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NavItem} from '../../../shared/nav-item';
import {MatMenuTrigger} from '@angular/material/menu';
import {UiService} from '../../../shared/ui.service';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-genre-detail',
  templateUrl: './genre-detail.component.html',
  styleUrls: ['./genre-detail.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ])
  ]
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
  filteredAlbums: Album[] = [];
  isLoadedAll: boolean;
  @ViewChild('searchText') searchTextRef: ElementRef;

  constructor(private firebaseService: FirebaseService,
              private router: Router,
              private uiService: UiService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const genreID = this.route.snapshot.params['id'];
    this.firebaseService.getGenreByID(genreID);
    this.uiService.genreSub.subscribe(genre => {
      this.genre = genre;
    });
    this.firebaseService.getAlbumsByGenre(genreID);
    this.firebaseService.allAlbumsSub.subscribe(allAlbums => {
      this.firebaseService.allAlbums = allAlbums;
      this.firebaseService.getNextItems();
      this.albums = this.firebaseService.albums;
      this.filteredAlbums = this.albums;
      this.firebaseService.albumsSubject.next(this.albums);
    });

    this.uiService.isLoadedAll.subscribe(isLoaded => {
      this.isLoadedAll = isLoaded;
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
      if(titleStr.length > 42){
        titleStr = titleStr.slice(0, 38) + '...';
      }
      return titleStr;
    } else {
      return 'Playlist';
    }
  }

  getSubTitle(album: Album){
    if (typeof album.author !== 'undefined' || album.author === ''){
      let subTitleStr = album.author;
      if(subTitleStr.length > 24){
        subTitleStr = subTitleStr.slice(0, 20) + ' ...';
      }
      return subTitleStr;
    } else {
      return '';
    }
  }

  onSelecSort(index){
    if(index === 0 || index === 1){
      this.sortByName(index);
    }
  }

  sortByName(index){
    this.filteredAlbums.sort((s1, s2) => {
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

  filterItem(){
    const searchText = this.searchTextRef.nativeElement.value.toLowerCase();
    this.filteredAlbums = this.albums.filter(album => {
      return (album.title.toLowerCase().includes(searchText) || album.author.toLowerCase().includes(searchText));
    });
  }

  clearText(){
    this.searchTextRef.nativeElement.value = '';
    this.filteredAlbums = this.albums;
    this.searchTextRef.nativeElement.focus();
  }
}
