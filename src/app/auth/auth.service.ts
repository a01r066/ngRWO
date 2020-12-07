import {Injectable} from '@angular/core';
import {AuthData} from './auth-data.model';
import {User} from './user.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;
  authChangeSub = new Subject<boolean>();
  auth = firebase.auth();

  constructor(private router: Router) {
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
    this.auth.createUserWithEmailAndPassword(email, password).then(result => {
      console.log("Sign up success! You've already signed In.");
      this.user = result.user;
      this.authChangeSub.next(true);
      this.router.navigate(['/library']);
    })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("ErrorCode: " +errorCode + ". Message: " + errorMessage);
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

    this.auth.signInWithEmailAndPassword(email, password).then(result => {
      console.log("Login success!. You've already signed In.");
      this.user = result.user;
      this.authChangeSub.next(true);
      this.router.navigate(['/library']);
    })
      .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("ErrorCode: " +errorCode + ". Message: " + errorMessage);
    });
  }

  logout(){
    this.auth.signOut().then(() => {
      this.user = null;
      this.authChangeSub.next(false);
      this.router.navigate(['/login']);
    }).catch(error => {
      console.log("Sign out error: " + error.message);
    });
  }

  getUser(){
    return { ...this.user };
  }

  isAuth(){
    return this.user != null;
  }
}
