import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Album} from '../../models/album.model';
import {FirebaseService} from '../../../firebase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavItem} from '../../../shared/nav-item';
import {MatMenuTrigger} from '@angular/material/menu';
import {animate, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../../../auth/auth.service';
import {UiService} from '../../../shared/ui.service';
import {Genre} from '../../models/genre.model';

@Component({
  selector: 'app-trend-detail',
  templateUrl: './trend-detail.component.html',
  styleUrls: ['./trend-detail.component.css'],
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
export class TrendDetailComponent implements OnInit, OnDestroy {
  albums: Album[];

  navItems: NavItem[] = [
    {
      title: 'Sort by A->Z'
    },
    {
      title: 'Sort by Z->A'
    }
    // {
    //   title: "Sort by Top Listen"
    // }
  ];

  // we create an object that contains coordinates
  menuTopLeftPosition =  {x: '0', y: '0'};
  // reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, {static: true}) deleteMenuTrigger: MatMenuTrigger;

  selectedAlbum: Album;
  options = ['Add to Library'];

  isAuth = false;
  trend: Genre;
  title = '';
  isSearch: boolean;

  constructor(private firebaseService: FirebaseService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.isSearch = this.firebaseService.isSearch;
    const trendID = this.route.snapshot.params['id'];
    if (trendID === 'recently-played'){
      if (this.firebaseService.playedAlbums.length === 0){
        // fetch playedAlbums
        const user = this.authService.getCurrentUser();
        this.firebaseService.getRecentPlayedAlbums(user);
      } else {
        this.albums = this.firebaseService.playedAlbums;
      }
      this.options.push('Delete');
      this.title = 'Recently Played';
      this.uiService.playedAlbumsSub.subscribe(albums => {
        this.albums = albums;
      });
    } else if (this.isSearch){
      this.title = 'Search results';
      this.albums = this.firebaseService.searchedAlbums;
    } else {
      this.firebaseService.getTrendByID(trendID);
      this.uiService.genreSub.subscribe(trend => {
        this.trend = trend;
        this.title = trend.title;
      });

      if (this.firebaseService.trendAlbums.length === 0){
        this.firebaseService.getTrendAlbumsByID(trendID);
        this.uiService.albumsSub.subscribe(albums => {
          this.albums = albums;
        });
      } else {
        this.albums = this.firebaseService.trendAlbums;
      }
    }
    this.isAuth = this.authService.isAuthenticated;
    this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  ngOnDestroy(): void {
    this.firebaseService.isSearch = false;
  }

  onSelectItem(album: Album){
    this.firebaseService.selectedAlbum = album;
    this.router.navigate(['playlist', album.id]);
  }

  getTitle(album: Album){
    if (typeof album.title !== 'undefined'){
      let titleStr = album.title;
      if (titleStr.length > 42){
        titleStr = titleStr.slice(0, 38) + '...';
      }
      return titleStr;
    } else {
      return 'My Playlist';
    }
  }

  getSubTitle(album: Album){
    if (typeof album.author !== 'undefined'){
      let subTitleStr = album.author;
      if (subTitleStr.length > 24){
        subTitleStr = subTitleStr.slice(0, 20) + ' ...';
      }
      return subTitleStr;
    } else {
      return 'Optional description';
    }
  }

  onSelecSort(index){
    if (index === 0 || index === 1){
      this.sortByName(index);
    }
  }

  sortByName(index){
    this.albums.sort((s1, s2) => {
      if (s1 === s2){
        return -1;
      }
      if (index === 0){
        return s1.title.toLowerCase().localeCompare(s2.title.toLowerCase());
      } else {
        return s2.title.toLowerCase().localeCompare(s1.title.toLowerCase());
      }
    });
  }

  onRightClick(event: MouseEvent, item: Album){
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();

    // we record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX - 16 + 'px';
    this.menuTopLeftPosition.y = event.clientY - 48 + 'px';

    // we open the menu
    // we pass to the menu the information about our object
    // this.matMenuTrigger.menuData = {item: item}
    this.selectedAlbum = item;

    // we open the menu
    this.deleteMenuTrigger.openMenu();
  }

  onClickOption(index: number){
    if (index === 0){
      this.onHandleLikeAlbum(this.selectedAlbum);
    } else {
      this.firebaseService.deleteRecentAlbum(this.authService.getUser(), this.selectedAlbum);
    }
  }

  onHandleLikeAlbum(album: Album){
    if (this.isAuth){
      this.firebaseService.addFavouriteAlbum(album, this.authService.getUser());
    } else {
      this.uiService.loginAlertChanged.next(true);
    }
  }
}
