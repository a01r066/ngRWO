import {Component, OnInit, ViewChild} from '@angular/core';
import {Album} from '../../models/album.model';
import {FirebaseService} from '../../../firebase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavItem} from '../../../shared/nav-item';
import {MatMenuTrigger} from '@angular/material/menu';
import {animate, style, transition, trigger} from '@angular/animations';

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
export class TrendDetailComponent implements OnInit {
  items: Album[];
  title: string;

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

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  constructor(private firebaseService: FirebaseService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    this.title = params.id;
    this.items = this.firebaseService.trendAlbums;
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
    this.items.sort((s1, s2) => {
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
}
