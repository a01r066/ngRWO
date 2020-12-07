import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAuth: boolean = false;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.authService.authChangeSub.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  onSelectLibrary(){
    if(!this.isAuth){
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/library']);
    }
  }
}
