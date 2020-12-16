import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UiService} from '../../ui.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import validate = WebAssembly.validate;
import {Album} from '../../../music/models/album.model';
import {FirebaseService} from '../../../firebase.service';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../auth/auth.service';

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
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

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
      const data = {
        title: this.playlistForm.value.title,
        author: this.playlistForm.value.author,
        // imagePath: this.imagePath
      };
      this.firebaseService.updatePlaylist(this.authService.getUser(), this.playlist, data);
      this.uiService.editPlaylistChanged.next(false);
      this.firebaseService.selectedAlbum = this.playlist;
    } else {
      console.log("Invalid");
      window.alert("Playlist's name must at least 6 characters!");
    }
  }

  mouseOver(){
    console.log("Mouse over");
    this.isEditPhoto = true;
  }

  mouseLeave(){
    console.log("Mouse leave");
    this.isEditPhoto = false;
  }

  onSelectPhoto(){
    console.log("Select photo");
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

  // onSubmit() {
  //   const formData = new FormData();
  //   formData.append('file', this.fileData);
  //   this.http.post('url/to/your/api', formData)
  //     .subscribe(res => {
  //       console.log(res);
  //       this.uploadedFilePath = res.data.filePath;
  //       alert('SUCCESS !!');
  //     })
  // }
}
