import {Component, ElementRef, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FirebaseService} from './firebase.service';
import {AuthService} from './auth/auth.service';
import {UiService} from './shared/ui.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Relaxing World Online';
  opened: boolean = true;
  mode = new FormControl('side');
  isAlertShow = false;
  isEditPlaylistShow = false;

  isGenreSelect = false;

  constructor(private authService: AuthService,
              private uiService: UiService) {
  }

  ngOnInit(): void {
    this.authService.initAuthListener();
    this.uiService.loginAlertChanged.subscribe(isAlert => {
      this.isAlertShow = isAlert;
    });
    this.uiService.editPlaylistChanged.subscribe(isEdit => {
      this.isEditPlaylistShow = isEdit;
    });

    this.uiService.isGenreSelectSub.subscribe(isGenreSelect => {
      this.isGenreSelect = isGenreSelect;
    });
  }
}
