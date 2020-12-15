import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UiService} from '../../ui.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import validate = WebAssembly.validate;
import {Album} from '../../../music/models/album.model';
import {FirebaseService} from '../../../firebase.service';
import {HttpClient} from '@angular/common/http';

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

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  constructor(private uiService: UiService,
              private firebaseService: FirebaseService,
              private http: HttpClient) { }

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
  }

  onDismiss(){
    this.uiService.editPlaylistChanged.next(false);
  }

  onSavePlaylist(){
    if(this.playlistForm.valid){
      console.log("Valid");
    } else {
      console.log("Invalid");
      window.alert("Playlist's name must at least 4 characters!");
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
