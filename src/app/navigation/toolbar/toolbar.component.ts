import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../../firebase.service';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';
import firebase from 'firebase';
import {ThemePalette} from '@angular/material/core';
import {UiService} from '../../shared/ui.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  isSearchBarHidden: boolean = true;
  @ViewChild('searchText') searchTextRef: ElementRef;
  isAuth: boolean = false;
  authSubscription: Subscription;

  links = ['Playlists', 'Liked Songs'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;

  isLibTabsShow = false;

  constructor(private firebaseService: FirebaseService,
              private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.firebaseService.isSearchBarHiddenSub.subscribe(isHidden => {
      this.isSearchBarHidden = isHidden;
    });

    this.authSubscription = this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });

    this.uiService.isLibraryTabsShowSub.subscribe(isShow => {
      this.isLibTabsShow = isShow;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  back(){
    window.history.back();
  }

  next(){
    window.history.forward();
  }

  clearText(){
    this.searchTextRef.nativeElement.value = '';
    this.firebaseService.searchTextSub.next('');
  }

  onTextChange(){
    this.processSearch();
  }

  onBackspace(){
    this.processSearch();
  }

  processSearch(){
    const searchText = this.searchTextRef.nativeElement.value;
    if(searchText === ''){
      this.clearText();
    } else {
      this.firebaseService.searchTextSub.next(searchText);
    }
  }

  logout(){
    this.authService.logout();
  }
}
