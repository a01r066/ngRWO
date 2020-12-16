import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UiService} from '../../ui.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import validate = WebAssembly.validate;
import {Album} from '../../../music/models/album.model';
import {FirebaseService} from '../../../firebase.service';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../auth/auth.service';
import firebase from 'firebase';

@Component({
  selector: 'app-edit-playlist',
  templateUrl: './edit-playlist.component.html',
  styleUrls: ['./edit-playlist.component.css']
})
export class EditPlaylistComponent implements OnInit {
  playlistForm: FormGroup;
  playlist: Album;
  imagePath: string;
  isEditPhoto = false;
  isAuth = false;

  fileData: File = null;
  previewUrl: any = null;

  constructor(private uiService: UiService,
              private firebaseService: FirebaseService,
              private http: HttpClient,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.playlistForm = new FormGroup({
      title: new FormControl('', {
        validators: [
          // Validators.required,
          Validators.minLength(4)]
      }),
      author: new FormControl()
    });

    this.playlist = this.firebaseService.selectedAlbum;
    this.imagePath = this.playlist.imagePath;

    this.playlistForm.patchValue({
      title: this.playlist.title,
      author: this.playlist.author,
      imagePath: this.imagePath
    });

    this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  onDismiss(){
    this.uiService.editPlaylistChanged.next(false);
  }

  onSavePlaylist(){
    if(this.playlistForm.valid){
      this.playlist.title = this.playlistForm.value.title;
      this.playlist.author = this.playlistForm.value.author;

      // upload image
      if(this.fileData !== null){
        this.uploadImageFile();
      } else {
        const data = {
          title: this.playlist.title,
          author: this.playlist.author
        };
        this.firebaseService.updatePlaylist(this.authService.getUser(), this.playlist, data);
        this.uiService.editPlaylistChanged.next(false);
        this.firebaseService.selectedAlbum = this.playlist;
      }
    } else {
      window.alert("Playlist's name must at least 6 characters!");
    }
  }

  uploadImageFile(){
    const storageRef = firebase.storage().ref('Images');
    // File or Blob named mountains.jpg
    const file = this.fileData;

    // Create the file metadata
    const metadata = {
      contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const uploadTask = storageRef.child('Playlists/' + file.name).put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      snapshot => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            // console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            // console.log('Upload is running');
            break;
        }
      }, error => {

        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          // console.log('File available at', downloadURL);
          const data = {
            title: this.playlist.title,
            author: this.playlist.author,
            imagePath: downloadURL
          };
          this.firebaseService.updatePlaylist(this.authService.getUser(), this.playlist, data);
          this.uiService.editPlaylistChanged.next(false);
          this.firebaseService.selectedAlbum = this.playlist;
          this.uiService.selectedAlbumSub.next(this.playlist);
          this.uiService.playlistImagePathSub.next(downloadURL);
        });
      });
  }

  mouseOver(){
    this.isEditPhoto = true;
  }

  mouseLeave(){
    this.isEditPhoto = false;
  }

  onSelectPhoto(){
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview
    let mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      this.imagePath = this.previewUrl;
    };
  }
}
