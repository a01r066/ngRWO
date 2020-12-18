import {Injectable} from '@angular/core';
import {AuthData} from './auth-data.model';
import {User} from './user.model';
import {from, Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import firebase from 'firebase';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UiService} from '../shared/ui.service';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import UserCredential = firebase.auth.UserCredential;
import {catchError} from 'rxjs/operators';
import {FirebaseService} from '../firebase.service';
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;
  authChangeSub = new Subject<boolean>();
  auth = firebase.auth();
  isAuthenticated: boolean = false;
  database = firebase.database();

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private uiService: UiService) {
  }

  initAuthListener(){
    this.auth.onAuthStateChanged(user => {
      if(user){
        // this.user = user;
        this.user = {
          uid: user.uid,
          email: user.email
        };
        this.isAuthenticated = true;
        this.authChangeSub.next(true);
      } else {
        this.user = null;
        this.isAuthenticated = false;
        this.authChangeSub.next(false);
      }
    });
  }

  updateGoogleUserToDB(userData: UserCredential){
    const user = userData.user;
    const value = {
      name: user.displayName,
      email: user.email,
      imagePath: user.photoURL
    };
    this.database.ref('Users').child(user.uid).update(value).then(() => {
      // console.log(user.displayName + " added to firebase db");
    });
  }

  updateUserToDB(userData: UserCredential, name: string){
    const user = userData.user;
    const value = {
      name: name,
      email: user.email
    };
    this.database.ref('Users').child(user.uid).update(value).then(() => {
      // console.log(name + " added to firebase db");
    });
  }

  registerUser(registerData: any){
    // sign up with firebase
    const name = registerData.name;
    const email = registerData.email;
    const password = registerData.password;
    this.uiService.loadingStateChanged.next(true);
    this.auth.createUserWithEmailAndPassword(email, password).then(result => {
      this.updateUserToDB(result, name);
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

  loginViaFb(){
    this.uiService.loadingStateChanged.next(true);
    let provider = new FacebookAuthProvider();
    // provider.addScope('user_photos');
    this.auth.signInWithPopup(provider).then(res => {
      // console.log(res);
      const name = res.user.displayName;
      const email = res.user.email;
      // console.log(name + ": " +email);
      this.updateGoogleUserToDB(res);
      this.uiService.loadingStateChanged.next(false);
      this.router.navigate(['/library']);
    }). catch(error => {
      this.uiService.loadingStateChanged.next(false);
      this.snackBar.open(error.message, null, {
        duration: 3000
      });
    });
  }

  loginViaGmail(){
    this.uiService.loadingStateChanged.next(true);
    this.auth.signInWithPopup(new GoogleAuthProvider()).then(res => {
        const name = res.user.displayName;
        const email = res.user.email;
        // console.log(res);
        this.updateGoogleUserToDB(res);
        this.uiService.loadingStateChanged.next(false);
        this.router.navigate(['/library']);
    }). catch(error => {
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
