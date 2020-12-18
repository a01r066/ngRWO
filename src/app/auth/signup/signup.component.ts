import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UiService} from '../../shared/ui.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  isLoadingStateChanged: boolean = false;
  loadingSub: Subscription;

  constructor(private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      })
    });

    this.loadingSub = this.uiService.loadingStateChanged.subscribe(isStateChanged => {
      this.isLoadingStateChanged = isStateChanged;
    });
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }

  onRegister(){
    const registerData = {
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
    };

    if(this.signupForm.valid){
      this.authService.registerUser(registerData);
    }
  }

  onGmailRegister(){
    this.authService.loginViaGmail();
  }

  onFbRegister(){
    this.authService.loginViaFb();
  }
}
