import {Injectable} from '@angular/core';
import {AuthData} from './auth-data.model';
import {User} from './user.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;
  authChangeSub = new Subject<boolean>();

  constructor(private router: Router) {
  }

  registerUser(authData: AuthData){
    this.user = {
      email: authData.email,
      userID: Math.round(Math.random() * 10000).toString()
    };
    this.authChangeSub.next(true);
    this.router.navigate(['/library']);
  }

  login(authData: AuthData){
    this.user = {
      email: authData.email,
      userID: Math.round(Math.random() * 10000).toString()
    };
    this.authChangeSub.next(true);
    this.router.navigate(['/library']);
  }

  logout(){
    this.user = null;
    this.authChangeSub.next(false);
  }

  getUser(){
    return { ...this.user };
  }

  isAuth(){
    return this.user != null;
  }
}
