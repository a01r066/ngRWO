import {Injectable} from '@angular/core';
import {AuthData} from './auth-data.model';
import {User} from './user.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import firebase from 'firebase';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UiService} from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;
  authChangeSub = new Subject<boolean>();
  auth = firebase.auth();
  isAuthenticated: boolean = false;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private uiService: UiService) {
  }

  initAuthListener(){
    this.auth.onAuthStateChanged(user => {
      if(user){
        this.user = user;
        this.isAuthenticated = true;
        this.authChangeSub.next(true);
      } else {
        this.user = null;
        this.isAuthenticated = false;
        this.authChangeSub.next(false);
      }
    });
  }

  registerUser(authData: AuthData){
    // this.user = {
    //   email: authData.email,
    //   userID: Math.round(Math.random() * 10000).toString()
    // };
    // this.authChangeSub.next(true);
    // this.router.navigate(['/library']);

    // sign up with firebase
    const email = authData.email;
    const password = authData.password;
    this.uiService.loadingStateChanged.next(true);
    this.auth.createUserWithEmailAndPassword(email, password).then(result => {
      // this.user = result.user;
      this.uiService.loadingStateChanged.next(false);
      this.router.navigate(['/library']);
    })
      .catch(error => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        this.uiService.loadingStateChanged.next(false);
        this.snackBar.open(error.message, null, {
          duration: 3000
        });
    });
  }

  login(authData: AuthData){
    // this.user = {
    //   email: authData.email,
    //   userID: Math.round(Math.random() * 10000).toString()
    // };
    // this.authChangeSub.next(true);
    // this.router.navigate(['/library']);

    // sign in with firebase
    const email = authData.email;
    const password = authData.password;

    this.uiService.loadingStateChanged.next(true);
    this.auth.signInWithEmailAndPassword(email, password).then(result => {
      this.uiService.loadingStateChanged.next(false);
      this.router.navigate(['/library']);
    })
      .catch(error => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
        this.uiService.loadingStateChanged.next(false);
        this.snackBar.open(error.message, null, {
          duration: 3000
        });
    });
  }

  logout(){
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch(error => {
    });
  }

  getUser(){
    return { ...this.user };
  }

  isAuth(){
    return this.isAuthenticated;
  }
}
