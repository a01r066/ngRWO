import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UiService} from '../../shared/ui.service';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {Store} from '@ngrx/store';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  // getErrorMessage() {
  //   if (this.email.hasError('required')) {
  //     return 'You must enter a value';
  //   }
  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }

  // isLoadingStateChanged: boolean = false;
  // loadingSub: Subscription;
  isLoading$: Observable<boolean>;

  constructor(private authService: AuthService,
              private uiService: UiService,
              private store: Store<{ui: fromApp.State}>) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(map(state => state.ui.isLoading));
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        validators: [Validators.required]
      })
    });

    // this.loadingSub = this.uiService.loadingStateChanged.subscribe(isStateChanged => {
    //   this.isLoadingStateChanged = isStateChanged;
    // });
  }

  // ngOnDestroy(): void {
  //   this.loadingSub.unsubscribe();
  // }

  onLogin(){
    const authData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    if(this.loginForm.valid){
      this.authService.login(authData);
    }
  }

  onGmailSignIn(){
    this.authService.loginViaGmail();
  }

  onFbLogin(){
    this.authService.loginViaFb();
  }
}
