import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../../firebase.service';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';
import {ThemePalette} from '@angular/material/core';
import {UiService} from '../../shared/ui.service';
import {MatMenuTrigger} from '@angular/material/menu';
import {NavItem} from '../../shared/nav-item';
import {User} from '../../auth/user.model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  isSearchBarHidden = true;
  @ViewChild('searchText') searchTextRef: ElementRef;
  searchedText = '';
  isAuth = false;
  authSubscription: Subscription;

  links = ['Playlists', 'Liked Songs', 'Albums'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;

  isLibTabsShow = false;
  selectedIndex: number;

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  navItems: NavItem[] = [
    // {
    //   title: 'Profile'
    // },
    {
      title: 'Log out'
    }
  ];

  dbUser: User;
  isOpened = true;

  constructor(private firebaseService: FirebaseService,
              private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.searchedText = this.firebaseService.searchedText;
    this.firebaseService.isSearchBarHiddenSub.subscribe(isHidden => {
      this.isSearchBarHidden = isHidden;
    });

    this.authSubscription = this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });

    this.uiService.isLibraryTabsShowSub.subscribe(isShow => {
      this.isLibTabsShow = isShow;
    });

    this.uiService.dbUserSub.subscribe(user => {
      this.dbUser = user;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onSelectItem(item){
    if (item.title === 'Log out'){
      this.authService.logout();
    }
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
    this.searchTextRef.nativeElement.focus();
    this.firebaseService.searchedText = '';
  }

  onTextChange(){
    this.processSearch();
  }

  onBackspace(){
    this.processSearch();
  }

  processSearch(){
    this.searchedText = this.searchTextRef.nativeElement.value;
    this.firebaseService.searchedText = this.searchedText;
    if (this.searchedText === ''){
      this.clearText();
    } else {
      this.firebaseService.searchTextSub.next(this.searchedText);
    }
  }

  logout(){
    this.authService.logout();
  }

  onClickLink(selectedIndex: number){
    this.selectedIndex = selectedIndex;
    this.activeLink = this.links[selectedIndex];
    this.uiService.selectedIndexSub.next(selectedIndex);
  }

  onToggle(){
    this.isOpened = !this.isOpened;
    this.uiService.isToggle.next(this.isOpened);
  }
}
