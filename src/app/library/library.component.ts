import {Component, OnDestroy, OnInit} from '@angular/core';
import {UiService} from '../shared/ui.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit, OnDestroy {
  constructor(private uiService: UiService,
              private authService: AuthService) { }

  ngOnInit(): void {
    if(this.authService.isAuthenticated){
      this.uiService.isLibraryTabsShowSub.next(true);
    }
  }

  ngOnDestroy(): void {
    this.uiService.isLibraryTabsShowSub.next(false);
  }
}
