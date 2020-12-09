import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Genre} from './music/models/genre.model';
import {HttpClient} from '@angular/common/http';
import {of, Subject} from 'rxjs';
import {Album} from './music/models/album.model';
import firebase from 'firebase';
import {Track} from './music/models/track.model';
import {UiService} from './shared/ui.service';

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

  trendingAlbumsListSub = new Subject<Album[][]>();
  tracksSub = new Subject<Track[]>();
  selectedTrackSub = new Subject<Track>();
  selectedAlbumSub = new Subject<Album>();
  isDataLoadedSub = new Subject<boolean>();
  searchTextSub = new Subject<string>();
  isSearchBarHiddenSub = new Subject<boolean>();

  allTracks: Track[];
  allTracksSub = new Subject<Track[]>();
  isAllTracksLoaded: boolean = false;

  constructor(private af: AngularFireDatabase,
              private httpClient: HttpClient,
              private uiService: UiService) {
  }

  fetchAllTracks(){
    let tracks: Track[] = [];
    this.database.ref('Tracks').once('value').then(snapshot => {
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
              duration: 0
            }
            const track = new Track(trackID, albumID, genreID, dataObj);
            tracks.push(track);
          });
        });
      });
      this.allTracks = tracks;
      this.isAllTracksLoaded = true;
      this.allTracksSub.next(tracks);
      this.isDataLoadedSub.next(true);
    });
  }

  getTracksByAlbum(){
    // console.log("GenreID: " + this.selectedAlbum.genreID + ": " + this.selectedAlbum.id);
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
          duration: 0
        }
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
        }

        const genre = new Genre(genreID, dataObj);
        trends.push(genre);
      });
    });
    return trends;
  }

  // End of music player controller
  getTrendingList(){
    let trendingList: Album[][] = [];
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
              tags: albumSnapshot.val().tags
            }
            const album = new Album(albumID, genreID, trendID, dataObj);
            albums.push(album);
          });
        });
        this.shuffleInPlace(albums);
        trendingList.push(albums);
        this.trendingAlbumsListSub.next(trendingList);
      });
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

  getAlbumsByGenre(genre: Genre){
    // console.log("GenreID: " + genre.id);
    const albums: Album[] = [];
    this.httpClient.get(this.apiURL+'Albums/'+genre.id+'.json').subscribe(jsonData => {
      const keys = Object.keys(jsonData);
      const values = Object.values(jsonData);
      for(let i = 0; i < keys.length; i++){
        const dataObj = {
          title: values[i]['title'],
          author: values[i]['author'],
          imagePath: values[i]['imagePath'],
          tags: values[i]['tags']
        };
        const album = new Album(keys[i], genre.id, '', dataObj);
        albums.push(album);
        this.isDataLoadedSub.next(true);
      }
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
    return genres;
  }
}
