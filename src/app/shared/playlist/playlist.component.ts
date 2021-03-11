import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Album} from '../../music/models/album.model';
import {Track} from '../../music/models/track.model';
import {FirebaseService} from '../../firebase.service';
import {PlayerService} from '../../services/player.service';
import {StreamState} from '../../interfaces/stream-state';
import {AudioService} from '../../services/audio.service';
import {AuthService} from '../../auth/auth.service';
import {UiService} from '../ui.service';
import {MatMenuTrigger} from '@angular/material/menu';
import {NavItem} from '../nav-item';
import {MatSort, Sort} from '@angular/material/sort';
import * as moment from 'moment';
import {FacebookService, UIParams, UIResponse} from 'ngx-facebook';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute} from '@angular/router';
import {ShareService} from '../../services/share.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})

export class PlaylistComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', 'title', 'played', 'duration', 'option'];
  isDataLoaded = false;
  album: Album;
  playingAlbum: Album;
  tracks: Track[];
  state: StreamState;
  selectedRowIndex = -1;
  isFirstLoad = true;
  isLikedAlbum = false;
  isAuth = false;
  favouriteList: boolean[] = [];
  playingTrack: Track;
  playlist: Album;
  isFileExisted = false;

  totalMins = 0;
  totalSecs = 0;
  totalDuration = 'N/A';
  totalLiked = 0;

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  private paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;

    if (this.paginator) {
      // console.log("this.applyFilter('');");
    }
  }

  dataSource = new MatTableDataSource<Track>();

  navItems: NavItem[] = [
    {
      title: 'New playlist'
    }
  ];
  constructor(private firebaseService: FirebaseService,
              private playerService: PlayerService,
              private audioService: AudioService,
              private authService: AuthService,
              private uiService: UiService,
              private fb: FacebookService,
              private _lightbox: Lightbox,
              private route: ActivatedRoute,
              private shareService: ShareService) { }

  ngOnInit(): void {
    this.playingAlbum = this.firebaseService.playingAlbum;
    this.totalLiked = this.firebaseService.getRandomPlayed(99, 9999);
    if (this.firebaseService.selectedAlbum){
      this.album = this.firebaseService.selectedAlbum;
      if (!this.playingAlbum){
        this.playingAlbum = this.album;
      }

      // update meta data for sharing facebook
      this.updateMetaDataForSharing(this.album);

      this.firebaseService.getTracksByAlbum(this.album);
      this.firebaseService.favouristAlbums.find(theAlbum => {
        if (theAlbum.id === this.album.id){
          this.isLikedAlbum = true;
        }
      });
    } else {
      const albumID = this.route.snapshot.params['id'];
      this.firebaseService.getAlbumByID(albumID);
      this.uiService.selectedAlbumSub.subscribe(album => {
        this.album = album;
        if (!this.playingAlbum){
          this.playingAlbum = this.album;
        }
        this.updateMetaDataForSharing(this.album);
        this.firebaseService.getTracksByAlbum(album);
      });
    }

    this.firebaseService.tracksSub.subscribe(tracks => {
      this.dataSource.data = tracks;
      this.tracks = tracks;
      this.isDataLoaded = true;

      this.fetchTracksDuration(tracks);

      // favourite list
      tracks.forEach(track => {
        this.favouriteList.push(false);
        // get mp3 duration
        // this.getMp3Duration(track);
      });
    });

    // load images
    // if (typeof this.album.filePath !== 'undefined'){
    //   this.isFileExisted = true;
    // }
    this.playerService.selectedRowIndexSub.subscribe(index => {
      this.selectedRowIndex = index;
    });

    this.audioService.getState().subscribe(state => {
      this.state = state;
    });

    this.uiService.isLikedAlbumSub.subscribe(isLike => {
      this.isLikedAlbum = isLike;
    });

    this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });

    this.isAuth = this.authService.isAuthenticated;
    this.uiService.favouriteListSub.subscribe(list => {
      this.favouriteList = list;
    });

    this.uiService.selectedTrackSub.subscribe(track => {
      this.playingTrack = track;
    });

    if (this.isAuth){
      this.firebaseService.getPlaylists(this.authService.getUser());
      this.uiService.favouritePlaylistsSub.subscribe(playlists => {
        // this.favouritePlaylists = playlists;
        this.navItems.push({
          title: 'Add to playlist',
          subItems: playlists
        });
        this.navItems.push({
          title: 'Save to liked songs'
        });
      });
    }
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  updateMetaDataForSharing(album: Album){
    const sharePath = 'https://mytunes.top/' + 'playlist/' + album.id;
    this.shareService.setFacebookTags(sharePath, album.title, album.author, album.imagePath);
  }

  fetchTracksDuration(tracks: Track[]){
    tracks.forEach(track => {
      if (typeof track.duration !== 'undefined'){
        this.analyzeDuration(track);
      }
    });
    this.getTotalDurations();
  }

  getTotalDurations(){
    const totalSeconds = (this.totalMins * 60) + this.totalSecs;
    this.totalDuration = this.formatTime(totalSeconds, 'HH:mm:ss');
  }

  analyzeDuration(track: Track){
    const durationStr = track.duration;
    const minStr = durationStr.slice(0, 2);
    const secondStr = durationStr.slice(3, 5);

    // tslint:disable-next-line:radix
    const min = parseInt(minStr);
    // tslint:disable-next-line:radix
    const sec = parseInt(secondStr);

    this.totalMins += min;
    this.totalSecs += sec;
  }

  getTrackTitle(track: Track){
    if (typeof track.title !== 'undefined' || track.title === ''){
      let titleStr = track.title;
      if (titleStr.length > 96){
        titleStr = titleStr.slice(0, 92) + '...';
      }
      return titleStr;
    } else {
      return '';
    }
  }

  getTrackSubTitle(track: Track){
    if (typeof track.author !== 'undefined' || track.author === ''){
      let subTitleStr = track.author;
      if (subTitleStr.length > 96){
        subTitleStr = subTitleStr.slice(0, 92) + ' ...';
      }
      return subTitleStr;
    } else {
      return '';
    }
  }

  getImagePath(){
    if (typeof this.album.imagePath !== 'undefined' || this.album.imagePath === ''){
      return this.album.imagePath;
    } else {
      return 'https://firebasestorage.googleapis.com/v0/b/rxrelaxingworld.appspot.com/o/Images%2FDefaults%2Fplaylist-empty.png?alt=media&token=6a8539e3-6337-4ec6-bec1-cbeea9cc0ebf';
    }
  }

  openGallery(){
    const album = {
      src: this.album.imagePath,
      caption: '',
      thumb: this.album.imagePath
    };
    this._lightbox.open([album], 0);
  }

  getTitle(){
    if (this.album){
      let titleStr = this.album.title;
      if (titleStr.length > 54){
        titleStr = titleStr.slice(0, 50) + '...';
      }
      return titleStr;
    } else {
      return '';
    }
  }

  getSubTitle(){
    if (this.album){
      let subTitleStr = this.album.author;
      if (subTitleStr.length > 64){
        subTitleStr = subTitleStr.slice(0, 60) + '...';
      }
      return subTitleStr;
    } else {
      return 'Description: N/A';
    }
  }

  openFile(track: Track, index: number){
    this.firebaseService.addToPlayedAlbums(this.album);
    this.firebaseService.playingAlbum = this.album;
    this.selectedRowIndex = index;
    if (typeof this.playingTrack !== 'undefined'){
      if (this.playingTrack.id === track.id || this.favouriteList[index] === true){
        this.uiService.isLikedTrackSub.next(true);
      } else {
        this.uiService.isLikedTrackSub.next(false);
      }
    }
    this.uiService.selectedTrackSub.next(track);
    this.uiService.selectedAlbumSub.next(this.album);
    this.playerService.files = this.tracks;
    this.playerService.openFile(track, index);
    if (this.isAuth){
      this.firebaseService.onAddRecentPlayedAlbum(this.authService.getUser(), this.album);
    }
  }

  handlePlay(){
    if (this.isFirstLoad){
      this.openFile(this.tracks[0], 0);
      this.isFirstLoad = false;
    } else {
      this.play();
    }
  }

  play(){
    this.playerService.play();
  }

  pause(){
    this.playerService.pause();
  }

  onHandleLikeAlbum(album: Album){
    if (this.isAuth){
      this.isLikedAlbum = !this.isLikedAlbum;
      this.uiService.isLikedAlbumSub.next(this.isLikedAlbum);
      if (this.isLikedAlbum){
        // add to favourite
        this.firebaseService.addFavouriteAlbum(album, this.authService.getUser());
      } else {
        // remove from playlist
        this.firebaseService.removeAlbumFromFavouriteAlbums(album, this.authService.getUser());
      }
    } else {
      this.uiService.loginAlertChanged.next(true);
    }
  }

  onHandleLikeTrack(track: Track, index: number){
    if (this.isAuth){
      this.favouriteList[index] = !this.favouriteList[index];
      this.uiService.favouriteListSub.next(this.favouriteList);
      if (this.favouriteList[index]){
        // add to liked songs
        this.firebaseService.addFavouriteTrack(track, this.authService.getUser());
      } else {
        // remove from liked songs
        this.firebaseService.removeTrackFromFavouriteTracks(track, this.authService.getUser());
      }
      if (typeof this.playingTrack !== 'undefined'){
        if (this.playingTrack.id === track.id){
          this.uiService.isLikedTrackSub.next(this.favouriteList[index]);
        }
      }
    } else {
      this.uiService.loginAlertChanged.next(true);
    }
  }

  onSelectItem(item: NavItem, index: number){
    if (item.title === 'New playlist'){
      if (this.isAuth){
        this.firebaseService.onCreatePlaylist();
      } else {
        this.uiService.loginAlertChanged.next(true);
      }
    } else if (item.title === 'Save to liked songs'){
      // console.log("Add to liked songs");
      this.firebaseService.addFavouriteTrack(this.tracks[index], this.authService.getUser());
    }
  }

  selectSubItem(item: Album, track: Track){
    this.firebaseService.addTrackToPlaylist(this.authService.getUser(), track, item);
  }

  sortData(){
    this.dataSource.sort = this.sort;
  }

  formatTime(time: number, format: string = 'HH:mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  // openPdf(){
  //   if (this.isAuth){
  //     window.open(this.album.filePath, '_blank');
  //   } else {
  //     this.uiService.loginAlertChanged.next(true);
  //   }
  // }

  share() {
    // this.shareService.getTags();
    // const albumID = this.route.snapshot.params['id'];
    this.firebaseService.addToPlayedAlbums(this.album);
    const sharePath = 'https://mytunes.top/' + 'playlist/' + this.album.id;
    // console.log(sharePath);
    const params: UIParams = {
      href: sharePath,
      method: 'share',
      display: 'popup',
      redirect_uri: sharePath,
      hashtag: this.album.title
      // link: sharePath,
      // method: 'feed'
    };

    this.fb.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));
  }
}
