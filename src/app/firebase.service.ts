import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Genre} from './music/models/genre.model';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {Album} from './music/models/album.model';
import firebase from 'firebase';
import {Track} from './music/models/track.model';
import {UiService} from './shared/ui.service';
import {User} from './auth/user.model';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  apiURL: string = "https://rxrelaxingworld.firebaseio.com/";
  database = firebase.database();

  // items: any;
  //
  // constructor(public af: AngularFireDatabase) {
  //   this.items = af.list('/data').valueChanges();
  // }
  //
  // addData(stat) {
  //   this.af.list('/data').push(stat);
  // }
  //
  // getData() {
  //   return this.items = this.af.list('/data').valueChanges();
  // }

  selectedGenre: Genre;
  selectedAlbum: Album;
  trendAlbums: Album[];

  favouristAlbums: Album[] = [];
  favouritePlaylists: Album[] =[];
  favouristTracks: Track[] = [];
  selectedTabIndex = 0;

  trendingAlbumsListSub = new Subject<Album[][]>();
  tracksSub = new Subject<Track[]>();
  isDataLoadedSub = new Subject<boolean>();
  searchTextSub = new Subject<string>();
  isSearchBarHiddenSub = new Subject<boolean>();

  allTracks: Track[];
  allTracksSub = new Subject<Track[]>();
  isAllTracksLoaded = false;

  globalAlbums: Album[];
  isGlobalAlbumsLoaded = false;
  globalAlbumsSub = new Subject<Album[]>();

  // refactor scroll to load more items
  albumsSubject = new BehaviorSubject<Album[]>([]);
  albums$ = this.albumsSubject.asObservable();
  albums: Album[] = [];
  allAlbums: Album[] = [];
  allAlbumsSub = new Subject<Album[]>();
  playlistCounter = 1;

  trends: Genre[] = [];
  trendingList: Album[][] = [];
  playedAlbums: Album[] = [];
  genres: Genre[] = [];

  constructor(private af: AngularFireDatabase,
              private httpClient: HttpClient,
              private uiService: UiService,
              private authService: AuthService,
              private router: Router) {
  }

  loadMore(): void {
    if(this.getNextItems()){
      this.albumsSubject.next(this.albums);
    }
  }

  getNextItems(): boolean {
    if(this.albums.length >= this.allAlbums.length){
      this.uiService.isLoadedAll.next(true);
      return false;
    }
    const remainingLength = Math.min(24, this.allAlbums.length - this.albums.length);
    this.albums.push(...this.allAlbums.slice(this.albums.length, this.albums.length + remainingLength));
    return true;
  }

  getPlaylists(user: User){
    const playlists: Album[] = [];
    this.database.ref('Playlists').child(user.uid).once('value').then(snapshot => {
      snapshot.forEach(playlistSnapshot => {
        const playlistID = playlistSnapshot.key;
        const genreID = '';
        const trendID = '';
        const dataObj = {
          title: playlistSnapshot.val().title,
          author: playlistSnapshot.val().author,
          imagePath: playlistSnapshot.val().imagePath,
          tags: playlistSnapshot.val().tags,
          filePath: playlistSnapshot.val().filePath
        };
        const playlist = new Album(playlistID, genreID, trendID, dataObj);
        playlists.push(playlist);
      });
      this.playlistCounter = playlists.length === 0 ? 1 : playlists.length;
      this.favouritePlaylists = playlists;
      this.uiService.favouritePlaylistsSub.next(playlists);
    });
  }

  getRandomPlayed(min, max){
    return Math.round(Math.random() * (max - min) + min);
  }

  getTracksByPlaylist(user: User){
    const tracks: Track[] = [];
    this.database.ref('Tracks-Playlist').child(user.uid).child(this.selectedAlbum.id).once('value').then(snapshot => {
      snapshot.forEach(genreSnapshot => {
        const genreID = genreSnapshot.key;
        genreSnapshot.forEach(albumSnapshot => {
          const albumID = albumSnapshot.key;
          albumSnapshot.forEach(trackSnapshot => {
            const trackID = trackSnapshot.key;
            const dataObj = {
              title: trackSnapshot.val().title,
              author: trackSnapshot.val().author,
              filePath: trackSnapshot.val().filePath,
              index: trackSnapshot.val().index,
              tags: trackSnapshot.val().tags,
              duration: trackSnapshot.val().duration,
              played: this.getRandomPlayed(149, 10499)
            };
            const track = new Track(trackID, albumID, genreID, dataObj);
            tracks.push(track);
          });
        });
      });
      // console.log("Playlist tracks: " + tracks.length);
      this.tracksSub.next(tracks);
    });
  }

  addTrackToPlaylist(user: User, track: Track, playlist: Album){
    const dataObj = {
      title: track.title,
      author: track.author,
      filePath: track.filePath
    };
    this.database.ref('Tracks-Playlist').child(user.uid).child(playlist.id).child(track.genreID).child(track.albumID).child(track.id).update(dataObj).then(() => {
      // refresh playlists
    });
  }

  deleteRecentAlbum(user: User, album: Album){
    this.database.ref('RecentPlayedAlbums').child(user.uid).child(album.genreID).child(album.id).remove(() => {
      // refresh playlists
      this.getRecentPlayedAlbums(user);
    });
  }

  deletePlaylist(user: User, playlist: Album){
    this.database.ref('Playlists').child(user.uid).child(playlist.id).remove(() => {
      // refresh playlists
      this.getPlaylists(user);
    });
  }

  updatePlaylist(user: User, playlist: Album, data: any){
    this.database.ref('Playlists').child(user.uid).child(playlist.id).update(data).then(() => {
      // refresh playlist
    });
  }

  getRecentPlayedAlbums(user: User){
    const albums: Album[] = [];
    this.database.ref('RecentPlayedAlbums').child(user.uid).once('value').then(snapshot => {
      snapshot.forEach(genreSnapshot => {
        const genreID = genreSnapshot.key;
        genreSnapshot.forEach(albumSnapshot => {
          const albumID = albumSnapshot.key;
          const trendID = '';
          const dataObj = {
            title: albumSnapshot.val().title,
            author: albumSnapshot.val().author,
            imagePath: albumSnapshot.val().imagePath,
            filePath: albumSnapshot.val().filePath,
            tags: albumSnapshot.val().tags
          };
          const album = new Album(albumID, genreID, trendID, dataObj);
          albums.push(album);
        });
      });
      this.playedAlbums = albums;
      this.uiService.playedAlbumsSub.next(albums);
    });
  }

  onAddRecentPlayedAlbum(user: User, album: Album){
    const dataObj = {
      title: album.title,
      author: album.author,
      imagePath: album.imagePath,
      filePath: '',
      tags: album.tags
    };
    this.database.ref('RecentPlayedAlbums').child(user.uid).child(album.genreID).child(album.id).update(dataObj).then();
  }

  onCreatePlaylist(){
    const playlistID = this.uuid();
    this.uiService.isPlaylistEdit = true;
    const user = this.authService.getUser();
    const data = {
      title: "My Playlist #" + this.playlistCounter,
      author: user.email,
      imagePath: "https://firebasestorage.googleapis.com/v0/b/rxrelaxingworld.appspot.com/o/Images%2FDefaults%2Fplaylist-empty.png?alt=media&token=6a8539e3-6337-4ec6-bec1-cbeea9cc0ebf",
      tags: "",
      filePath: ""
    };

    const genreID = "";
    const trendID = "";
    let album = new Album(playlistID, genreID, trendID, data);
    this.selectedAlbum = album;
    this.uiService.isPlaylist = true;
    this.createPlaylist(user, playlistID, data);
    this.router.navigate(['playlist', playlistID]);
  }

  createPlaylist(user: User, playlistID: string, data: any){
    // console.log("PlaylistID: " + playlistID);
    // const databObj = {
    //   title: data.title,
    //   author: data.author,
    //   imagePath: data.imagePath
    // };
    this.database.ref('Playlists').child(user.uid).child(playlistID).update(data).then(() => {
      // refresh playlists
    });
  }

  uuid(){
    return Math.random().toString(36).substring(2, 24);
  }

  fetchFavouriteTracks(user: User){
    const tracks: Track[] = [];
    this.database.ref('Favourite-Tracks').child(user.uid).once('value').then(snapshot => {
      snapshot.forEach(genreSnapshot => {
        const genreID = genreSnapshot.key;
        genreSnapshot.forEach(albumSnapshot => {
          const albumID = albumSnapshot.key;
          albumSnapshot.forEach(trackSnapshot => {
            const trackID = trackSnapshot.key;
            const dataObj = {
              title: trackSnapshot.val().title,
              author: trackSnapshot.val().author,
              filePath: trackSnapshot.val().filePath,
              index: trackSnapshot.val().index,
              duration: trackSnapshot.val().duration,
              tags: trackSnapshot.val().tags,
              played: this.getRandomPlayed(149, 10499)
            };
            const track = new Track(trackID, albumID, genreID, dataObj);
            tracks.push(track);
          });
        });
      });
      this.favouristTracks = tracks;
      this.uiService.favouriteTracksSub.next(tracks);
    });
  }

  removeTrackFromPlaylist(user: User, playlist: Album, track: Track){
    this.database.ref('Tracks-Playlist').child(user.uid).child(playlist.id).child(track.genreID).child(track.albumID).child(track.id).remove(() => {
      this.getTracksByPlaylist(user);
    });
  }

  removeTrackFromFavouriteTracks(track: Track, user: User){
    const genreID = track.genreID;
    const albumID = track.albumID;
    const trackID = track.id;
    this.database.ref('Favourite-Tracks').child(user.uid).child(genreID).child(albumID).child(trackID).remove((error) => {
      // refresh favourite playlists
      this.fetchFavouriteTracks(user);
    });
  }

  addFavouriteTrack(track: Track, user: User){
    const genreID = track.genreID;
    const albumID = track.albumID;
    const trackID = track.id;
    const dataObj = {
      title: track.title,
      author: track.author,
      filePath: track.filePath,
      played: this.getRandomPlayed(149, 10499),
      duration: track.duration
    };

    this.database.ref('Favourite-Tracks').child(user.uid).child(genreID).child(albumID).child(trackID).update(dataObj).then(() => {
      // console.log("Added to liked songs");
      // refresh favourite liked songs
    });
  }

  fetchFavouriteAlbums(user: User){
    let albums: Album[] = [];
    const trendID = "";
    this.database.ref('Favourite-Playlists').child(user.uid).once('value').then(snapshot => {
      snapshot.forEach(genreSnapshot => {
        const genreID = genreSnapshot.key;
        genreSnapshot.forEach(albumSnapshot => {
          const albumID = albumSnapshot.key;
          const dataObj = {
            title: albumSnapshot.val().title,
            author: albumSnapshot.val().author,
            imagePath: albumSnapshot.val().imagePath,
            tags: albumSnapshot.val().tags,
            filePath: albumSnapshot.val().filePath
          };
          const album = new Album(albumID, genreID, trendID, dataObj);
          albums.push(album);
        });
      });
      this.favouristAlbums = albums;
      this.uiService.favouriteAlbumsSub.next(albums);
    });
  }

  removeAlbumFromFavouriteAlbums(album: Album, user: User){
    const genreID = album.genreID;
    const albumID = album.id;
    this.database.ref('Favourite-Playlists').child(user.uid).child(genreID).child(albumID).remove((error) => {
      // refresh favourite playlists
      this.fetchFavouriteAlbums(user);
    });
  }

  addFavouriteAlbum(album: Album, user: User){
    const genreID = album.genreID;
    const albumID = album.id;
    const dataObj = {
      title: album.title,
      author: album.author,
      imagePath: album.imagePath
    };

    this.database.ref('Favourite-Playlists').child(user.uid).child(genreID).child(albumID).update(dataObj).then(() => {
      // console.log("Added to favourite playlists");
      // refresh favourite playlists
    });
  }

  fetchAllAlbums(){
    let albums: Album[] = [];
    this.database.ref('Albums').once('value').then(snapshot => {
      snapshot.forEach(genreSnapshot => {
        const genreID = genreSnapshot.key;
        if(genreID !== '-MOoSXRlWkDrdSHyNKT5' && genreID !== '-MRIZIZ-wo9AnsJVy_EH'){
          genreSnapshot.forEach(albumSnapshot => {
            const albumID = albumSnapshot.key;
            const trendID = '';
            const dataObj = {
              title: albumSnapshot.val().title,
              author: albumSnapshot.val().author,
              imagePath: albumSnapshot.val().imagePath,
              tags: albumSnapshot.val().tags,
              filePath: albumSnapshot.val().filePath
            };
            const album = new Album(albumID, genreID, trendID, dataObj);
            albums.push(album);
          });
        }
      });
      this.globalAlbums = albums;
      this.isGlobalAlbumsLoaded = true;
      this.globalAlbumsSub.next(albums);
    });
  }

  fetchAllTracks(){
    let tracks: Track[] = [];
    this.database.ref('Tracks').once('value').then(snapshot => {
      snapshot.forEach(genreSnapshot => {
        const genreID = genreSnapshot.key;
        if(genreID !== '-MOoSXRlWkDrdSHyNKT5' && genreID !== '-MRIZIZ-wo9AnsJVy_EH'){
          genreSnapshot.forEach(albumSnapshot => {
            const albumID = albumSnapshot.key;
            albumSnapshot.forEach(trackSnapshot => {
              const trackID = trackSnapshot.key;
              const dataObj = {
                title: trackSnapshot.val().title,
                author: trackSnapshot.val().author,
                filePath: trackSnapshot.val().filePath,
                index: trackSnapshot.val().index,
                tags: trackSnapshot.val().tags,
                duration: trackSnapshot.val().duration,
                played: this.getRandomPlayed(149, 10499)
              };
              const track = new Track(trackID, albumID, genreID, dataObj);
              tracks.push(track);
            });
          });
        }
      });
      this.allTracks = tracks;
      this.isAllTracksLoaded = true;
      this.allTracksSub.next(tracks);
      // this.isDataLoadedSub.next(true);
    });
  }

  getTracksByAlbum(){
    const tracks: Track[] = [];
    this.database.ref('Tracks').child(this.selectedAlbum.genreID).child(this.selectedAlbum.id).once('value').then(snapshot => {
      snapshot.forEach(itemSnapshot => {
        // console.log(itemSnapshot.val().title);
        const id = itemSnapshot.key;
        const dataObj = {
          title: itemSnapshot.val().title,
          author: itemSnapshot.val().author,
          filePath: itemSnapshot.val().filePath,
          tags: itemSnapshot.val().filePath,
          index: itemSnapshot.val().index,
          duration: itemSnapshot.val().duration,
          played: this.getRandomPlayed(149, 44149)
        };
        const track = new Track(id, this.selectedAlbum.id, this.selectedAlbum.genreID, dataObj);
        tracks.push(track);
      });
      tracks.sort((t1, t2) => {
        return t1.index - t2.index;
      });
      // console.log("TracksCount: " + tracks.length);
      this.tracksSub.next(tracks);
    });
  }

  getTrends(){
    const trends: Genre[] = [];
    this.database.ref('Music-Trending-List').once('value').then(snapshot => {
      snapshot.forEach(itemSnapshot => {
        const genreID = itemSnapshot.key;

        const dataObj = {
          title: itemSnapshot.val().title,
          imagePath: itemSnapshot.val().imagePath
        };

        const genre = new Genre(genreID, dataObj);
        trends.push(genre);
      });
    });
    this.trends = trends;
    return trends;
  }

  // End of music player controller
  getTrendingList(){
    const trendingList: Album[][] = [];
    this.database.ref('Trending-Albums').once('value').then(snapshot => {
      snapshot.forEach(trendSnapshot => {
        const trendID = trendSnapshot.key;
        let albums: Album[] = [];

        trendSnapshot.forEach(genreSnapshot => {
          const genreID = genreSnapshot.key;
          genreSnapshot.forEach(albumSnapshot => {
            const albumID = albumSnapshot.key;
            const dataObj = {
              title: albumSnapshot.val().title,
              author: albumSnapshot.val().author,
              imagePath: albumSnapshot.val().imagePath,
              tags: albumSnapshot.val().tags,
              filePath: albumSnapshot.val().filePath
            };
            const album = new Album(albumID, genreID, trendID, dataObj);
            albums.push(album);
          });
        });
        this.shuffleInPlace(albums);
        trendingList.push(albums);
      });
      this.trendingList = trendingList;
      this.trendingAlbumsListSub.next(trendingList);
    });
  }

  // The recommended (simple) algorithm is the Fisher–Yates shuffle
  shuffleInPlace(array: Album[]){
    // if it's 1 or 0 items, just return
    if(array.length <= 1){
      return array;
    }
    // For each index in array
    for (let i = 0; i < array.length; i++) {
      // choose a random not-yet-placed item to place there
      // must be an item AFTER the current item, because the stuff
      // before has all already been placed
      const randomChoiceIndex = this.getRandom(i, array.length - 1);
      // place our random choice in the spot by swapping
      [array[i], array[randomChoiceIndex]] = [array[randomChoiceIndex], array[i]];
    }
    return array;
  }

  getRandom(start: number, end: number){
    return Math.floor(Math.random() * end);
  }

  resetAlbums(){
    this.albumsSubject = new BehaviorSubject<Album[]>([]);
    this.albums$ = this.albumsSubject.asObservable();
    this.allAlbums = [];
    this.albums = [];
    this.allAlbumsSub = new Subject<Album[]>();
  }

  getAlbumsByGenre(genre: Genre){
    this.resetAlbums();
    const albums: Album[] = [];
    this.httpClient.get(this.apiURL+'Albums/'+genre.id+'.json').subscribe(jsonData => {
      const keys = Object.keys(jsonData);
      const values = Object.values(jsonData);
      for(let i = 0; i < keys.length; i++){
        const dataObj = {
          title: values[i]['title'],
          author: values[i]['author'],
          imagePath: values[i]['imagePath'],
          tags: values[i]['tags'],
          filePath: values[i]['filePath']
        };
        const album = new Album(keys[i], genre.id, '', dataObj);
        albums.push(album);
        this.isDataLoadedSub.next(true);
      }
      // return albums
      this.allAlbumsSub.next(albums);
    });
    return albums;
  }

  getGenres() {
    const genres: Genre[] = [];
    this.httpClient.get(this.apiURL + 'Genres.json').subscribe(jsonData => {
      const keys = Object.keys(jsonData);
      const values = Object.values(jsonData);
      for(let i = 0; i < keys.length; i++){
        const dataObj = {
          title: values[i]['title'],
          imagePath: values[i]['imagePath']
        };
        const genre = new Genre(keys[i], dataObj);
        genres.push(genre);
        this.isDataLoadedSub.next(true);
      }
    });
    this.genres = genres;
    return genres;
  }
}
