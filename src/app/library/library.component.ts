import {Component, OnDestroy, OnInit} from '@angular/core';
import {UiService} from '../shared/ui.service';
import {AuthService} from '../auth/auth.service';
import {FirebaseService} from '../firebase.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit, OnDestroy {
  selectedIndex: number;
  isAuth = false;
  constructor(private uiService: UiService,
              private authService: AuthService,
              private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.selectedIndex = this.firebaseService.selectedTabIndex;
    if(this.authService.isAuthenticated){
      this.uiService.isLibraryTabsShowSub.next(true);
    }
    this.uiService.selectedIndexSub.subscribe(index => {
      this.selectedIndex = index;
      this.firebaseService.selectedTabIndex = index;
    });
  }

  ngOnDestroy(): void {
    this.uiService.isLibraryTabsShowSub.next(false);
  }
}
