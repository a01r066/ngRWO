import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {UiService} from '../../shared/ui.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAuth: boolean = false;

  constructor(private authService: AuthService,
              private router: Router,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  onSelectLibrary(){
    if(!this.isAuth){
      // this.router.navigate(['/login']);
      // this.router.navigate(['auth']);
      this.uiService.loginAlertChanged.next(true);
    } else {
      this.router.navigate(['/library']);
    }
  }
}
